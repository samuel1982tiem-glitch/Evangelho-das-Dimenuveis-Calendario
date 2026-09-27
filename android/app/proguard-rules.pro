# Keep WebView & AndroidX Webkit classes intact
-keep class androidx.webkit.** { *; }
-keepattributes *Annotation*,InnerClasses,Signature
-dontwarn androidx.webkit.**
