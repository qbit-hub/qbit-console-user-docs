# انتشار ورک‌لود با ایمیج

Qbit می‌تواند یک **ورک‌لود مبتنی بر Container image** را روی سرور ریموتی که متعلق به خود شماست اجرا و مدیریت کند. Qbit در این فرایند سرور یا فضای ابری در اختیار شما نمی‌گذارد؛ سرور انتشار باید از قبل به Workspace اضافه و توسط Agent فعال شده باشد.

## پیش‌نیازها

پیش از ساخت ورک‌لود بررسی کنید:

- سرور مقصد در همان Workspace ثبت شده، enrollment آن فعال است و غیرفعال نشده است؛
- Agent سرور capability مربوط به `deploy` را اعلام می‌کند؛
- image موردنظر از خود سرور مقصد قابل pull است؛
- اگر image خصوصی است، اطلاعات دسترسی Registry را فقط از ورودی write-only خود Console تنظیم کنید و آن را در توضیحات، نام ورک‌لود یا گزارش پشتیبانی قرار ندهید.

:::info
تمام اجراها در Phase 1 روی **سرور شخص ثالث متعلق به مشتری** انجام می‌شوند. Qbit-hosted compute بخشی از این workflow نیست.
:::

## ۱. ساخت ورک‌لود

در Workspace وارد **Workloads** شوید و **ساخت ورک‌لود** را انتخاب کنید.

برای یک application مبتنی بر image:

1. نام و در صورت نیاز توضیح را وارد کنید.
2. **سرور انتشار** را از سرورهای ریموت همان Workspace انتخاب کنید.
3. در **منبع**، گزینه **ایمیج کانتینر** را انتخاب کنید.
4. image reference را وارد کنید؛ برای مثال از یک نام غیرواقعی مانند `registry.example.invalid/team/web:1.2.3` در مستندات یا تست‌ها استفاده کنید.
5. فهرست Runtime Compose files را فقط مطابق تعریف runtime خودتان تغییر دهید.
6. ورک‌لود را ایجاد کنید.

برای image workload، build جداگانه‌ای اجرا نمی‌شود؛ منبع image مستقیماً وارد مدل revision ورک‌لود می‌شود و runtime فعلی از Docker Compose استفاده می‌کند.

## ۲. پیکربندی مقادیر و secretها

صفحه ورک‌لود بخش **پیکربندی مدیریت‌شده** دارد. مقادیر جدید با revision جدید ذخیره می‌شوند.

فرمت فعلی ورودی مقدار:

```text
scope|name|true-or-false|value
```

scopeهای پشتیبانی‌شده عبارت‌اند از:

- `interpolation`
- `runtime_environment`
- `build_argument`
- `build_secret`

مقدار سوم مشخص می‌کند داده private است یا خیر. `build_secret` باید private باشد و `build_argument` نمی‌تواند private باشد.

برای حذف مقدار:

```text
scope|name
```

:::warning
مقدارهای private پس از ذخیره به شکل plaintext دوباره نمایش داده نمی‌شوند. Console برای secretهای موجود فقط metadata امن مانند configured بودن و reference را نمایش می‌دهد. secret واقعی را در نام workload، description، route، log یا ticket پشتیبانی تکرار نکنید.
:::

### دسترسی به Registry خصوصی

در **Registry access** می‌توانید وضعیت فعلی را نگه دارید، دسترسی username-based یا identity-based تنظیم کنید، یا دسترسی ذخیره‌شده را پاک کنید.

فیلد **Registry private value** یک ورودی write-only است. بعد از ذخیره، UI فقط وضعیت پیکربندی و host امن Registry را نشان می‌دهد؛ مقدار private برای read-back برگردانده نمی‌شود.

## ۳. پورت، Domain و TLS

Routeهای ورک‌لود در بخش configuration با این قالب ثبت می‌شوند:

```text
component|domain|path|port|tls_mode|optional_certificate_ref
```

قواعد فعلی:

- `path` باید با `/` شروع شود؛
- port باید در بازه ۱ تا ۶۵۵۳۵ باشد؛
- `tls_mode` یکی از `disabled`، `automatic` یا `certificate_ref` است؛
- در حالت `certificate_ref` از reference معتبر استفاده کنید؛ secret یا certificate material خام را در route وارد نکنید؛
- برای `component` از component key واقعی همان workload/effective definition استفاده کنید.

نمونه صرفاً نمایشی:

```text
<component-key>|app.example.invalid|/|8080|automatic|
```

Qbit authoritative DNS hosting ارائه نمی‌کند. Domain باید بیرون از Qbit به سرور/مسیر مناسب اشاره کند و route فقط رفتار workload در control plane را تعریف می‌کند.

## ۴. Volume و محدودیت منابع

در UI فعلی image workload، editor مستقل برای volume یا CPU/RAM وجود ندارد. تنظیمات پیشرفته runtime در **Qbit Compose override** اعمال می‌شوند و با configuration revision بعدی وارد چرخه اعتبارسنجی می‌شوند.

پیش از تغییر storage یا resource settings:

- effective definition فعلی را بررسی کنید؛
- mount/volume و limitها را مطابق runtime واقعی سرور خودتان تعریف کنید؛
- بعد از هر تغییر، revision جدید را دوباره validate کنید؛
- توقف یا حذف workload را معادل حذف خودکار داده persistent فرض نکنید. چرخه‌عمر داده به تعریف Compose/volume و storage روی سرور خود شما بستگی دارد.

برای داده مهم، قبل از تغییر destructive یا حذف workload سیاست backup مستقل خود را بررسی کنید.

## ۵. اعتبارسنجی قبل از انتشار

بعد از ساخت یا تغییر source/configuration، **اعتبارسنجی نسخه‌های فعلی** را اجرا کنید.

اعتبارسنجی، source revision و configuration revision جاری را بررسی می‌کند و در صورت موفقیت یک **effective definition سانسورشده** در اختیار UI قرار می‌دهد. اگر validation ناموفق است:

- diagnosticهای نمایش‌داده‌شده را بررسی کنید؛
- image reference، Registry access، route و configuration را اصلاح کنید؛
- سپس revisionهای جدید را دوباره validate کنید.

دکمه انتشار برای revisionهای فعلی بدون validation موفق قابل استفاده نیست.

## ۶. انتشار، وضعیت و توقف

پس از validation موفق، **انتشار نسخه اعتبارسنجی‌شده** را انتخاب کنید.

هر اقدام یک deployment attempt ثبت می‌کند. stateهای فعلی عبارت‌اند از:

- `queued`
- `running`
- `succeeded`
- `failed`
- `cancelled`
- `timed_out`

از صفحه workload می‌توانید وضعیت runtime مشاهده‌شده و drift را ببینید. **توقف** یک عملیات stop برای همان workload روی سرور ثبت‌شده ایجاد می‌کند؛ توقف به معنی حذف workload یا داده persistent نیست.

## ۷. تاریخچه، log، retry و rollback

بخش **تاریخچه انتشار** دو نوع سابقه را نگه می‌دارد:

- deployment attemptها؛
- deployment revisionهای immutable.

برای هر attempt می‌توانید جزئیات و **لاگ‌های سانسورشده ورک‌لود** را ببینید. UI در صورت موجود بودن correlation ID، operation ID و job ID را نیز برای عیب‌یابی نشان می‌دهد.

بسته به state/نتیجه:

- attempt در حال اجرا یا صف‌شده را می‌توان لغو کرد؛
- attempt قابل‌تکرار را می‌توان با **تکرار همان نسخه** دوباره اجرا کرد؛
- یک deployment revision قبلی را می‌توان با **بازگشت به نسخه** دوباره منتشر کرد.

**Retry exact revision** همان snapshot قبلی را هدف می‌گیرد. اگر source یا configuration را تغییر داده‌اید، ابتدا revision جدید را validate و سپس deploy کنید؛ retry جایگزین validation تغییرات جدید نیست.

## ۸. حذف workload

عملیات **حذف** یک lifecycle action واقعی است. قبل از حذف:

- مطمئن شوید workload و Workspace درست را انتخاب کرده‌اید؛
- وضعیت deploymentهای فعال را بررسی کنید؛
- برای داده persistent، storage/volume و backup را مستقل بررسی کنید.

Qbit نباید از روی حذف workload نتیجه بگیرد که همه volumeها یا داده‌های روی سرور شما نیز حذف شده‌اند.

## رفع اشکال

### Image pull ناموفق است

- image reference را بررسی کنید؛
- مطمئن شوید سرور مقصد به Registry دسترسی شبکه دارد؛
- برای Registry خصوصی، host و write-only credential configuration را دوباره تنظیم کنید؛
- secret را در log یا پیام پشتیبانی کپی نکنید.

### سرور برای انتشار قابل انتخاب/استفاده نیست

وضعیت enrollment/connection Agent و capability `deploy` را بررسی کنید. وجود server ID یا route به‌تنهایی مجوز یا capability اجرا نیست.

### Domain یا TLS کار نمی‌کند

قالب route، component key، port، path و `tls_mode` را بررسی کنید. در `certificate_ref` از reference معتبر استفاده کنید. تنظیم DNS بیرون از Qbit را نیز بررسی کنید.

### Deployment ناموفق است

ابتدا deployment detail و log سانسورشده را ببینید. correlation/operation/job ID را برای پیگیری نگه دارید. اگر مشکل transient و attempt قابل‌تکرار است، همان revision را retry کنید؛ اگر configuration را اصلاح کرده‌اید، revision جدید را validate/deploy کنید.

## نکات امنیتی

- Qbit فقط سرورهای ریموت متعلق به مشتری را هدف می‌گیرد؛
- secretها را فقط از فیلدهای write-only وارد کنید؛
- effective definition و logها باید redacted باشند، اما همچنان قبل از اشتراک‌گذاری خروجی عیب‌یابی آن را بازبینی کنید؛
- tenant/workspace و server target را پیش از deploy، stop، rollback یا delete دوباره بررسی کنید؛
- credential ماشین Agent، private key، token، certificate material خام یا secret را در مستندات و ticketها قرار ندهید.

همچنین ببینید: [سرورهای ریموت](/guide/remote-servers)، [عملیات ریموت و ترمینال](/guide/remote-operations)، [امنیت](/guide/security) و [رفع اشکال](/guide/troubleshooting).
