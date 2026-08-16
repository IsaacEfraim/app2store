# עובדות מאומתות לאתר app2store

אומת מול מקורות רשמיים של Google, Apple, Base44, Expo ו Supabase בתאריך 16 באוגוסט 2026.
כל ציטוט באנגלית הוא הנוסח הרשמי המדויק כפי שהוא מופיע במקור. אין לתרגם ציטוט ואז להציג אותו כציטוט.
כל פריט שלא הצלחתי לאמת מסומן **UNVERIFIED** ואסור לפרסם אותו כעובדה.

---

## מחלוקת 1: אימות מפתחי אנדרואיד והתאריך 30 בספטמבר 2026

### הפסיקה: שני הכותבים צדקו חלקית, ושניהם טעו

הבלבול נובע מכך שמדובר בשלושה מנגנונים נפרדים עם תאריכים ותוצאות שונות. חובה להפריד ביניהם.

---

### 1א. רישום שמות חבילה ב Play Console. תאריך יעד 30 בספטמבר 2026, תוצאה גלובלית

**הטענה בשורה אחת:** כל מפתח ב Google Play, כולל מפתח ישראלי, צריך לוודא עד 30 בספטמבר 2026 שכל האפליקציות שלו רשומות בעמוד הבית של Play Console. גוגל כותבת במפורש שהמטרה היא להימנע מהסרה גלובלית מ Google Play.

**מקור:** https://developer.android.com/developer-verification/guides/google-play-console

**נוסח רשמי מדויק:**
> "Play developers must register their app package names, which may include proving ownership of the private signing keys used for those packages."

> "While 99% of apps on Play have been registered automatically using information you have already provided, you should check your Play Console Home page."

> "By September 30, 2026, register any remaining apps you want to continue distributing to avoid global removal from Google Play and ensure a seamless user installation experience."

> "For new apps, when you create an app in the Google Play Console, Google Play automatically registers the package name and links it to your account."

**מקור נוסף, הודעת הבלוג של יוני 2026:** https://android-developers.googleblog.com/2026/06/android-developer-verification.html
> "you should check your Play Console Home page to register any remaining apps by September 30, 2026 to avoid global removal from Google Play"

> "You can also use Play Console to register apps you distribute outside of Google Play to ensure they can be installed on certified Android devices."

**מה זה אומר לקופי:** הביטוי "global removal from Google Play" הוא מילה במילה של גוגל. מותר לצטט אותו. אסור להציג את זה כאילו האפליקציה נמחקת אוטומטית ב 1 באוקטובר, גוגל לא מפרטת מנגנון אכיפה או לוח זמנים להסרה בפועל.

---

### 1ב. אימות זהות המפתח. עבור רוב מפתחי Play לא נדרשת פעולה חדשה

**הטענה בשורה אחת:** מי שכבר עבר את אימות הזהות של Play Console לא צריך לעשות שום דבר נוסף בשביל אימות מפתחי אנדרואיד.

**מקור:** https://developer.android.com/developer-verification/guides/google-play-console
> "For most Play developers, no new action is required for identity verification. Your existing verified identity (such as for Play's developer verification requirements) meets this requirement."

**מקור:** https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html
> "Today, we're starting to roll out Android developer verification to all developers in both the new Android Developer Console and Play Console."

> "If you've completed Play Console's developer verification requirements, your identity is already verified and we'll automatically register eligible Play apps for you."

**כאן טמון חלק מהבלבול:** קיים אימות זהות נפרד ומוקדם יותר של חשבון Play Console, עם תוצאה משלו שאינה קשורה לתאריך ספטמבר 2026.

**מקור:** https://support.google.com/googleplay/android-developer/answer/10841920
> "If Google can't verify your developer information or your contact information, your developer presence and apps may be removed from Google Play, and you won't be able to republish your app until you've verified your information."

---

### 1ג. אכיפה ברמת ההתקנה במכשיר. אזורית בלבד עד 2027

**הטענה בשורה אחת:** החסימה בפועל של התקנת אפליקציות במכשירים מוסמכים מתחילה ב 30 בספטמבר 2026 רק עבור משתמשים בברזיל, אינדונזיה, סינגפור ותאילנד, וההרחבה הגלובלית מתוכננת ל 2027.

**מקור:** https://developer.android.com/developer-verification
> "These protections begin for users installing apps from participating stores (Google Play, HONOR App Market, OPPO App Market, Galaxy Store, Palm Store, V-Appstore, GetApps) in Brazil, Indonesia, Singapore, and Thailand, on certified devices running Android 7+. In 2027, we'll expand this globally to all apps on certified devices."

ציר הזמן הרשמי באותו עמוד:
> "August 2026: Developer APIs, limited distribution accounts, and power user advanced flow launch."

> "September 30, 2026: Regional deadline in Brazil, Indonesia, Singapore, and Thailand for participating app stores."

> "2027 and beyond: Global rollout for all certified Android devices."

**מקור:** https://support.google.com/android-developer-console/answer/16561738
> "Starting September 30, 2026, these new developer verification protections will go live for users in Brazil, Indonesia, Singapore, and Thailand"

> "Apps from developers who have not completed these steps by the deadline will be unavailable for new installation on certified Android devices in applicable countries."

**מקור:** https://android-developers.googleblog.com/2026/06/android-developer-verification.html
> "These new developer verification protections will take effect on September 30, 2026, starting with users in Brazil, Indonesia, Singapore, and Thailand."

---

### מה בדיוק צריך לעשות, עד מתי, ומה קורה אם לא

| מה | עד מתי | מה קורה אם לא |
|---|---|---|
| לרשום שמות חבילה של כל האפליקציות בעמוד הבית של Play Console | 30 בספטמבר 2026 | גוגל: "to avoid global removal from Google Play". 99 אחוז מהאפליקציות כבר נרשמו אוטומטית |
| לאמת זהות מפתח | אין תאריך חדש למי שכבר מאומת ב Play Console | גוגל: "no new action is required for identity verification" עבור רוב מפתחי Play |
| אכיפה בהתקנה במכשיר | 30 בספטמבר 2026 בברזיל, אינדונזיה, סינגפור ותאילנד. גלובלי ב 2027 | האפליקציה "unavailable for new installation on certified Android devices in applicable countries" |

### מה מותר לכתוב באתר

מותר: יש תאריך יעד אמיתי ב 30 בספטמבר 2026 שרלוונטי גם למפתח ישראלי, והוא נוגע לרישום שמות החבילה ב Play Console. גוגל עצמה מנסחת את הסיכון כ global removal from Google Play.

מותר: החסימה של התקנות במכשירים מתחילה רק בארבע מדינות, וההרחבה הגלובלית שלה היא ב 2027.

אסור: לכתוב שאין שום דחיפות למפתח ישראלי. זו הטעות של כותב א.

אסור: לכתוב שהאכיפה נקבעת לפי מיקום המשתמש ולכן אפליקציה תוסר גלובלית. ההסרה מ Play נקבעת לפי סטטוס הרישום של המפתח. מיקום המשתמש רלוונטי רק למנגנון החסימה בהתקנה במכשיר. זו הטעות של כותב ב.

**UNVERIFIED:** ראיתי בסיכומי צד שלישי טענה על סף של 50 התקנות שמחייב בקשה נפרדת לשימוש בשם חבילה. לא מצאתי אישור לכך בנוסח רשמי של גוגל. אין להשתמש בזה.

---

## מחלוקת 2: שאלון הגישה לפרודקשן

### הפסיקה: הטענה ש Google מציגה "ספק בדיקות בתשלום" כתשובה אפשרית היא לא נכונה

**הטענה בשורה אחת:** הטופס של גוגל מבקש לבחור אפשרות שמתארת **כמה קל היה** לגייס בודקים, לא **איך** גייסת אותם. אין רשימת תשובות שכוללת ספק בדיקות בתשלום.

**מקור:** https://support.google.com/googleplay/android-developer/answer/14151465

הנוסח הרשמי של השאלה:
> "Select an option indicating how easy it was to recruit testers for your app"

ההמלצה הרשמית של גוגל לגיוס בודקים:
> "The most common way to recruit testers is to use personal and professional networks."

שאר החלקים בטופס מנוסחים כשאלות פתוחות, למשל:
> "Summarize the feedback received from testers and describe how feedback was collected"

וכן בחלק על האפליקציה:
> "Select an estimated install range for your app or game during its first year"

**מה מותר לטעון:** מותר לומר שהטופס כולל שאלה על גיוס הבודקים, ושגוגל מציינת שהדרך הנפוצה היא רשתות אישיות ומקצועיות. מותר לומר שיש שדות פתוחים שבהם המפתח מתאר את הבדיקות והמשוב.

**מה אסור לטעון:** אסור לכתוב או לרמוז שגוגל מציעה "ספק בדיקות בתשלום" כתשובה מוכנה, כתשובה צפויה או כאפשרות ברשימה. זה לא קיים בטופס.

**UNVERIFIED:** לא הצלחתי לאמת את רשימת אפשרויות הבחירה המדויקת שמופיעה בתוך התפריט הנפתח של שאלת הגיוס. עמוד העזרה מתאר את השאלה אך לא מפרט את האפשרויות. אין להמציא אותן.

---

## מחלוקת 3: פרסום לחנויות מתוך Base44

### הפסיקה: Base44 מייצרת IPA ו AAB, בתוכנית Builder ומעלה, אבל לא מגישה בשבילך

**הטענה בשורה אחת:** Base44 מייצרת קבצי IPA ל iOS ו AAB לאנדרואיד, אך ההגשה, חשבונות המפתח והטיפול בביקורת החנות נשארים באחריות בעל האפליקציה.

**מקור:** https://docs.base44.com/documentation/building-your-app/uploading-to-app-stores

**מה Base44 כן עושה, נוסח רשמי:**
> "Get your Base44 app store-ready by scanning, improving, and packaging it for the Apple App Store and Google Play."

הפורמטים: IPA bundle ל iOS, AAB bundle לאנדרואיד. אין אזכור ליצירת APK בתיעוד.

**דרישת התוכנית, נוסח רשמי:**
> "You must be on the Builder plan or higher to download your app files."

**מה Base44 לא עושה בשבילך, נוסח רשמי:**
> "You are responsible for setting up and paying for your Apple and Google developer accounts, as well as managing your app listings and submissions."

> "Base44 support does not check on the status of your submission, contact Apple or Google on your behalf, or manage store review feedback for you."

> "Base44 cannot guarantee that an app is approved, even with a high readiness score."

**דרישות מוקדמות שמופיעות בתיעוד:** אפליקציה מפורסמת עם כתובת יציבה, חשבונות מפתח פעילים ב Apple ו Google עם גישת API, אייקון שעומד בדרישות החנויות, ומדיניות פרטיות ותנאי שימוש שנגישים מהעמודים הראשיים של האפליקציה.

**מתי זה יצא:** מקור צד שלישי, Tech.co, מתארך את ההשקה ל 9 בפברואר 2026. https://tech.co/news/base44-publish-app-store
**UNVERIFIED:** לא מצאתי תאריך השקה רשמי בתיעוד של Base44 עצמה. אם רוצים לכתוב תאריך, יש לייחס אותו ל Tech.co ולא ל Base44.

**מה זה אומר לפוזישנינג של app2store:** הפער אמיתי ואפשר לתאר אותו בלי להגזים. Base44 מייצרת את הקובץ. מה שנשאר הוא חשבונות המפתח, אימות הזהות, רישום שם החבילה, הצהרות התוכן ב Play Console, מסלול הבדיקות הסגורות, נכסי החנות, והטיפול בסבבי ביקורת. Base44 כותבת בעצמה שהיא לא נוגעת באף אחד מאלה.

---

## אישורים קצרים לשאר הטענות

### Android App Bundle חובה לאפליקציות חדשות מאוגוסט 2021

**מקור:** https://developer.android.com/guide/app-bundle
> "From August 2021, new apps are required to publish with the Android App Bundle on Google Play."

**דיוק חשוב:** גוגל מנסחת את החובה על **פורמט ה App Bundle**, לא על Play App Signing. לגבי Play App Signing התיעוד מדבר על רישום אוטומטי ולא על חובה מפורשת.

**מקור:** https://support.google.com/googleplay/android-developer/answer/9842756
> "By default, when you upload your app bundle, your app is automatically enrolled in quantum-ready, hybrid signing with Google-generated keys."

**אין לכתוב:** "Play App Signing חובה מאוגוסט 2021". **מותר לכתוב:** "פורמט App Bundle חובה לאפליקציות חדשות מאוגוסט 2021, והעלאה שלו רושמת את האפליקציה אוטומטית ל Play App Signing".

### איפוס מפתח העלאה אפשרי

**מקור:** https://support.google.com/googleplay/android-developer/answer/9842756
> "If you lose your upload key or suspect that it was compromised, you are not locked out of your app."

לגבי מפתח החתימה עצמו:
> "This key cannot be reset if you manage it yourself (without Play App Signing) and lose it."

זו נקודת מכירה אמיתית: מי שמנהל את המפתח לבד ומאבד אותו, מאבד את היכולת לעדכן את האפליקציה.

### הצהרת סוחר לפי ה DSA

**מאומת עבור Apple:** https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/
> "Even if you don't distribute apps in the EU, you'll still need to declare a trader status."

> "Apple can't determine whether you're a trader"

התיעוד מציין גם שאפליקציות שונות יכולות לקבל הצהרת סוחר שונה.

**UNVERIFIED עבור Google Play:** לא מצאתי עמוד עזרה רשמי של Google שמחייב הצהרת סוחר לפי ה DSA מכל מפתחי Play. עמוד ה EEA הרשמי של גוגל עוסק ב Digital Markets Act ולא ב Digital Services Act. https://support.google.com/googleplay/android-developer/answer/14659200

**מסקנה לקופי:** אסור לכתוב "כל מפתחי Play חייבים להצהיר על סטטוס סוחר". מותר לכתוב את הטענה לגבי Apple בלבד, עם הציטוט למעלה. אם רוצים לכלול את Google, צריך למצוא קודם עמוד רשמי של גוגל.

### בנייה ל iOS בלי מק

**הטענה בשורה אחת:** אפשר לבנות אפליקציית iOS בענן בלי להחזיק מחשב מק, אבל עדיין צריך חברות בתוכנית המפתחים של Apple בעלות 99 דולר לשנה.

**מקור:** https://docs.expo.dev/build/introduction/
> "iOS builds run on macOS runners hosted in Expo's macOS cloud"

**מקור:** https://docs.expo.dev/build-reference/infrastructure/
> "iOS builder VMs run on Mac mini hosts in an isolated environment. Every build gets its own fresh macOS VM."

**מקור:** https://docs.expo.dev/build/setup/
> "If you are going to use EAS Build to create release builds for the Apple App Store, you need access to an account with a $99 USD Apple Developer Program membership."

**דיוק:** אף אחד מהמקורות לא אומר במילים מפורשות "אתה לא צריך מק". הם אומרים שהבנייה רצה על מכונות macOS בענן של הספק. זו טענה שאפשר לנסח בבטחה כ"הבנייה רצה על מכונות macOS בענן, כך שלא צריך מק מקומי", ולא כציטוט.

### ברירות המחדל של Supabase Auth

**מקור:** https://supabase.com/docs/guides/auth/passwords
> "Email authentication is enabled by default."

לגבי אימות כתובת מייל:
> "You can configure whether users need to verify their email to sign in. On hosted Supabase projects, this is true by default. On self-hosted projects or in local development, this is false by default."

**UNVERIFIED:** לא מצאתי אמירה רשמית מפורשת ש ספקי OAuth חברתיים או כניסה אנונימית מושבתים כברירת מחדל. התיעוד של הכניסה האנונימית מנוסח כהוראת הפעלה, "Enable Anonymous Sign-Ins", מה שמרמז שצריך להפעיל אותה, אבל זו לא אמירה מפורשת. אין לצטט את זה כעובדה.

### תנאי הבדיקות הסגורות ב Play

**מקור:** https://support.google.com/googleplay/android-developer/answer/14151465
> "Google Play requires personal developer accounts created after November 13, 2023, to test their apps before those apps are eligible for distribution on Google Play."

> "Developers with personal accounts created after November 13, 2023, must run a closed test for their app with a minimum of 12 testers"

> "At least 12 testers must be opted in to your closed test when you apply for production access, and they must have been opted in continuously for the preceding 14 days."

> "Testers who opt in, test for fewer than 14 days, and then opt out do not count toward the requirement."

**דיוק חשוב:** הדרישה חלה על חשבונות אישיים שנפתחו אחרי 13 בנובמבר 2023. חשבונות ארגוניים לא מוזכרים כחייבים בה.

**UNVERIFIED:** עמוד העזרה לא אומר במפורש אם אפליקציה שנייה מאותו חשבון חייבת לעבור שוב את המסלול אחרי שהתקבלה גישה לפרודקשן. אין לטעון לכיוון זה או אחר.

### Apple 4.8, שירותי כניסה

**מקור:** https://developer.apple.com/app-store/review/guidelines/

הנוסח הרשמי המלא:
> "Apps that use a third-party or social login service (such as Facebook Login, Google Sign-In, Log in with X, Sign In with LinkedIn, Login with Amazon, or WeChat Login) to set up or authenticate the user's primary account with the app must also offer as an equivalent option another login service with the following features: the login service limits data collection to the user's name and email address; the login service allows users to keep their email address private as part of setting up their account; and the login service does not collect interactions with your app for advertising purposes without consent."

החריגים, נוסח רשמי:
> "Another login service is not required if: Your app exclusively uses your company's own account setup and sign-in systems. Your app is an alternative app marketplace, or an app distributed from an alternative app marketplace, that uses a marketplace-specific login for account, download, and commerce features. Your app is an education, enterprise, or business app that requires the user to sign in with an existing education or enterprise account. Your app uses a government or industry-backed citizen identification system or electronic ID to authenticate users. Your app is a client for a specific third-party service and users are required to sign in to their mail, social media, or other third-party account directly to access their content."

**הדיוק שחשוב:** הכלל לא מחייב Sign in with Apple בשמו. הוא מחייב "another login service" שעומד בשלושת המאפיינים. Sign in with Apple עומד בהם, אבל הוא לא הדרך היחידה. אסור לכתוב "אפל מחייבת Sign in with Apple".

### Apple 4.2.2, פונקציונליות מינימלית

**מקור:** https://developer.apple.com/app-store/review/guidelines/

הנוסח הרשמי המלא, מילה במילה:
> "Other than catalogs, apps shouldn't primarily be marketing materials, advertisements, web clippings, content aggregators, or a collection of links."

**הדיוק שחשוב:** המילה היא "primarily". הכלל לא אוסר על אפליקציה להכיל תוכן שיווקי או קישורים. הוא אוסר על אפליקציה להיות **בעיקרה** כזו. בנוסף יש פטור מפורש לקטלוגים, "Other than catalogs". אסור לכתוב שאפל דוחה כל אפליקציה שמבוססת על אתר.

### Apple 3.1.1, הפטור לחנות ארצות הברית

**מקור:** https://developer.apple.com/app-store/review/guidelines/

הכלל הבסיסי:
> "If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase."

הפטור לחנות ארצות הברית, בהקשר של אוספי NFT:
> "Apps may allow users to browse NFT collections owned by others, provided that, except for apps on the United States storefront, the apps may not include buttons, external links, or other calls to action that direct customers to purchasing mechanisms other than in-app purchase."

ובסעיף 3.1.1(a), הניסוח הכללי של הפטור:
> "Developers may apply for entitlements to provide a link in their app to a website the developer owns or maintains responsibility for in order to purchase digital content or services. These entitlements are not required for developers to include buttons, external links, or other calls to action in their United States storefront apps."

**הדיוק שחשוב:** בחנות ארצות הברית לא נדרש entitlement כדי לכלול כפתורים או קישורים חיצוניים לרכישה. מחוץ לחנות ארצות הברית עדיין צריך entitlement. זה פטור לפי חנות, לא לפי מיקום המפתח.

### דרישות כתובת מחיקת חשבון מהאינטרנט ב Google Play

**מקור:** https://support.google.com/googleplay/android-developer/answer/13327111

> "The user must be able to request deletion of their account through the pathway."

> "The weblink must be functional (for example, loads without error), relevant in scope (for example, the pathway to request account deletion should be prominently featured and easily discoverable on the page)"

התיעוד גם מציין שהמסלול צריך לעבוד בלי להחזיר את המשתמש לאפליקציה:
> "without sending the user back to the app and requiring them to re-download it to submit their request"

הקישור מוזן בשדה ייעודי ב Play Console, בתוך מקטע Data safety בעמוד App content.

**UNVERIFIED:** לא מצאתי אמירה רשמית מפורשת שהעמוד חייב להיות נגיש בלי התחברות. התיעוד מדבר על נגישות וגילוי, לא על היעדר התחברות. אין לטעון "בלי צורך בהתחברות" כציטוט.

---

## נקודה נוספת שלא נשאלה עליה אבל קריטית ל app2store

### Apple 4.2.6, שירותי יצירת אפליקציות ותבניות

**מקור:** https://developer.apple.com/app-store/review/guidelines/

> "Apps created from a commercialized template or app generation service will be rejected unless they are submitted directly by the provider of the app's content. These services should not submit apps on behalf of their clients and should offer tools that let their clients create customized, innovative apps that provide unique customer experiences."

**למה זה חשוב:** זהו הכלל הרלוונטי ביותר למודל העסקי של המרת אפליקציות Base44 ו Lovable לחנויות. הוא אומר שהאפליקציה צריכה להיות מוגשת ישירות על ידי בעל התוכן, ולא על ידי השירות בשמו. כלומר, ההגשה צריכה לצאת מחשבון המפתח של הלקוח.

זו נקודה שכדאי להפוך ליתרון בקופי, שהעבודה נעשית בתוך חשבון המפתח של הלקוח, ולא לנסות להתחמק ממנה.

---

## סיכום בשורה אחת לכל מחלוקת

1. **אימות מפתחי אנדרואיד:** יש תאריך יעד גלובלי אמיתי ב 30 בספטמבר 2026 לרישום שמות חבילה ב Play Console, ובמקביל אכיפה בהתקנה שמתחילה רק בארבע מדינות ומתרחבת ב 2027. כותב א טעה בכך שאין דחיפות. כותב ב טעה בכך שההסרה נקבעת לפי מיקום המשתמש.
2. **שאלון הפרודקשן:** גוגל שואלת כמה קל היה לגייס בודקים, לא איך. אין אפשרות רשומה של ספק בדיקות בתשלום. אסור לטעון שיש.
3. **Base44:** מייצרת IPA ו AAB בתוכנית Builder ומעלה, ובמפורש לא מגישה, לא מנהלת חשבונות מפתח ולא מטפלת בביקורת החנות.
