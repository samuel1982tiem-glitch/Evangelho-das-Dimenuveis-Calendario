package com.dimenueveis.calendar;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.CalendarContract;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.webkit.WebViewAssetLoader;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://appassets.androidplatform.net/assets/public/index.html";
    private static final String NOTIFICATION_CHANNEL_ID = "dimenueveis_feasts_channel";

    private WebView webView;
    private String pendingGeolocationOrigin;
    private GeolocationPermissions.Callback pendingGeolocationCallback;
    private String pendingIcsContent;
    private ActivityResultLauncher<String[]> locationPermissionLauncher;
    private ActivityResultLauncher<String> notificationPermissionLauncher;
    private ActivityResultLauncher<Intent> saveIcsDocumentLauncher;

    private boolean isLocationPermissionGranted() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    private boolean isNotificationPermissionGranted() {
        if (Build.VERSION.SDK_INT >= 33) {
            return ContextCompat.checkSelfPermission(this, "android.permission.POST_NOTIFICATIONS") == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    private void createNotificationChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                NotificationChannel channel = new NotificationChannel(
                        NOTIFICATION_CHANNEL_ID,
                        "Alertas de Festas e Sábados",
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Notificações de Festas Bíblicas, Sábados e Fases Lunares do Calendário Dimenúvel");
                manager.createNotificationChannel(channel);
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        createNotificationChannelIfNeeded();

        locationPermissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                result -> {
                    Boolean fineGranted = result.get(Manifest.permission.ACCESS_FINE_LOCATION);
                    Boolean coarseGranted = result.get(Manifest.permission.ACCESS_COARSE_LOCATION);
                    boolean granted = (fineGranted != null && fineGranted) || (coarseGranted != null && coarseGranted);

                    if (pendingGeolocationCallback != null && pendingGeolocationOrigin != null) {
                        pendingGeolocationCallback.invoke(pendingGeolocationOrigin, granted, false);
                        pendingGeolocationCallback = null;
                        pendingGeolocationOrigin = null;
                    }

                    if (webView != null) {
                        final String js = "window.dispatchEvent(new CustomEvent('androidGpsPermissionResult', { detail: { granted: " + granted + " } }));";
                        webView.post(() -> webView.evaluateJavascript(js, null));
                    }
                }
        );

        notificationPermissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                granted -> {
                    if (webView != null) {
                        final String js = "window.dispatchEvent(new CustomEvent('androidNotificationPermissionResult', { detail: { granted: " + granted + " } }));";
                        webView.post(() -> webView.evaluateJavascript(js, null));
                    }
                }
        );

        saveIcsDocumentLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    boolean saved = false;
                    if (result.getResultCode() == RESULT_OK && result.getData() != null && result.getData().getData() != null && pendingIcsContent != null) {
                        Uri uri = result.getData().getData();
                        try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                            if (os != null) {
                                os.write(pendingIcsContent.getBytes(StandardCharsets.UTF_8));
                                os.flush();
                                saved = true;
                            }
                        } catch (Exception ignored) {
                        }
                    }
                    pendingIcsContent = null;
                    if (saved) {
                        Toast.makeText(MainActivity.this, "Arquivo .ICS salvo com sucesso!", Toast.LENGTH_LONG).show();
                    }
                    if (webView != null) {
                        final boolean finalSaved = saved;
                        final String js = "window.dispatchEvent(new CustomEvent('androidIcsSaveResult', { detail: { saved: " + finalSaved + " } }));";
                        webView.post(() -> webView.evaluateJavascript(js, null));
                    }
                }
        );

        Window window = getWindow();
        if (window != null) {
            window.setStatusBarColor(Color.parseColor("#0c0e14"));
            window.setNavigationBarColor(Color.parseColor("#0c0e14"));
        }

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        webView.setBackgroundColor(Color.parseColor("#0c0e14"));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(APP_HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (isLocationPermissionGranted()) {
                    callback.invoke(origin, true, false);
                } else {
                    pendingGeolocationOrigin = origin;
                    pendingGeolocationCallback = callback;
                    locationPermissionLauncher.launch(new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    });
                }
            }
        });
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (url != null && APP_HOST.equalsIgnoreCase(url.getHost())) {
                    return false;
                }
                if (url != null && ("http".equalsIgnoreCase(url.getScheme()) || "https".equalsIgnoreCase(url.getScheme()))) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, url);
                        startActivity(intent);
                    } catch (Exception ignored) {
                    }
                    return true;
                }
                return false;
            }
        });

        setContentView(webView);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
        }
    }

    public class AndroidBridge {
        @JavascriptInterface
        public boolean isAndroidApk() {
            return true;
        }

        @JavascriptInterface
        public boolean hasLocationPermission() {
            return isLocationPermissionGranted();
        }

        @JavascriptInterface
        public boolean hasNotificationPermission() {
            return isNotificationPermissionGranted();
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33 && !isNotificationPermissionGranted()) {
                    notificationPermissionLauncher.launch("android.permission.POST_NOTIFICATIONS");
                } else if (webView != null) {
                    webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('androidNotificationPermissionResult', { detail: { granted: true } }));",
                            null
                    );
                }
            });
        }

        @JavascriptInterface
        public void showNotification(String title, String body) {
            runOnUiThread(() -> {
                try {
                    createNotificationChannelIfNeeded();
                    NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                    if (manager != null && isNotificationPermissionGranted()) {
                        NotificationCompat.Builder builder = new NotificationCompat.Builder(MainActivity.this, NOTIFICATION_CHANNEL_ID)
                                .setSmallIcon(R.mipmap.ic_launcher)
                                .setContentTitle(title)
                                .setContentText(body)
                                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                                .setPriority(NotificationCompat.PRIORITY_HIGH)
                                .setAutoCancel(true);
                        manager.notify((int) (System.currentTimeMillis() & 0xfffffff), builder.build());
                    }
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void printPage(String documentTitle) {
            runOnUiThread(() -> {
                try {
                    if (webView == null) return;
                    PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null) {
                        String jobName = (documentTitle != null && !documentTitle.isEmpty())
                                ? documentTitle
                                : "Almanaque-Dimenuveis";
                        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter(jobName);
                        PrintAttributes.Builder builder = new PrintAttributes.Builder()
                                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                .setColorMode(PrintAttributes.COLOR_MODE_COLOR);
                        printManager.print(jobName, printAdapter, builder.build());
                    }
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void saveIcsFile(String fileName, String icsContent) {
            runOnUiThread(() -> {
                try {
                    pendingIcsContent = icsContent;
                    String safeName = (fileName != null && !fileName.isEmpty())
                            ? fileName
                            : "Festas-Biblicas.ics";
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("text/calendar");
                    intent.putExtra(Intent.EXTRA_TITLE, safeName);
                    saveIcsDocumentLauncher.launch(intent);
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void insertCalendarEvent(String title, String description, long startMillis, long endMillis, String fallbackUrl) {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_INSERT)
                            .setData(CalendarContract.Events.CONTENT_URI)
                            .putExtra(CalendarContract.Events.TITLE, title)
                            .putExtra(CalendarContract.Events.DESCRIPTION, description)
                            .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, startMillis)
                            .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endMillis)
                            .putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, true);
                    startActivity(intent);
                } catch (Exception e) {
                    try {
                        Intent fallbackIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl));
                        startActivity(fallbackIntent);
                    } catch (Exception ignored) {
                    }
                }
            });
        }

        @JavascriptInterface
        public void requestLocationPermission() {
            runOnUiThread(() -> {
                if (!isLocationPermissionGranted()) {
                    locationPermissionLauncher.launch(new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    });
                } else if (webView != null) {
                    webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('androidGpsPermissionResult', { detail: { granted: true } }));",
                            null
                    );
                }
            });
        }

        @SuppressLint("MissingPermission")
        @JavascriptInterface
        public String getLastKnownLocationJson() {
            if (!isLocationPermissionGranted()) {
                return "";
            }
            try {
                LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                if (locationManager == null) {
                    return "";
                }
                Location bestLocation = null;
                String[] providers = new String[]{
                        LocationManager.GPS_PROVIDER,
                        LocationManager.NETWORK_PROVIDER,
                        LocationManager.PASSIVE_PROVIDER
                };
                for (String provider : providers) {
                    try {
                        if (locationManager.isProviderEnabled(provider)) {
                            Location loc = locationManager.getLastKnownLocation(provider);
                            if (loc != null) {
                                if (bestLocation == null || loc.getTime() > bestLocation.getTime()) {
                                    bestLocation = loc;
                                }
                            }
                        }
                    } catch (Exception ignored) {
                    }
                }
                if (bestLocation != null) {
                    return String.format(
                            Locale.US,
                            "{\"latitude\":%.6f,\"longitude\":%.6f}",
                            bestLocation.getLatitude(),
                            bestLocation.getLongitude()
                    );
                }
            } catch (Exception ignored) {
            }
            return "";
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
