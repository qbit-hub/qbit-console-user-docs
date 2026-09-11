# عملیات ریموت و ترمینال

Qbit عملیات روی **سرور شخص ثالث متعلق به خود شما** را از صفحه جزئیات همان سرور انجام می‌دهد. این قابلیت‌ها سرور را به زیرساخت Qbit منتقل نمی‌کنند و برای مدیریت میزبان‌ها یا کانتینرهای داخلی خود Qbit نیستند.

از Workspace وارد **Infrastructure → Servers** شوید، سرور را باز کنید و از تب‌های **مانیتورینگ**، **کانتینرها**، **عملیات**، **ترمینال** و **هشدار و ارسال‌ها** استفاده کنید.

## پیش‌نیاز: Agent و capabilityها

قابلیت‌های زنده بر اساس capabilityهایی که Agent همان سرور اعلام می‌کند فعال می‌شوند. اگر پنل پیام «پشتیبانی نمی‌شود» نمایش دهد، ابتدا وضعیت اتصال/enrollment و capability سرور را بررسی کنید؛ دانستن شناسه سرور یا دیدن route به‌تنهایی مجوز اجرای عملیات نیست.

- `monitor` برای درخواست جمع‌آوری متریک تازه لازم است؛
- دسترسی خواندن Docker برای دیدن کانتینرها لازم است؛
- lifecycle Docker برای `start` / `stop` / `restart` لازم است؛
- `terminal` برای ترمینال تعاملی لازم است.

`Unavailable` بودن connection با `Stale` بودن آخرین snapshot متفاوت است: اولی وضعیت اتصال سرور/Agent را توصیف می‌کند و دومی فقط می‌گوید جدیدترین observation ذخیره‌شده قدیمی است.

## عملیات تایپ‌شده

عملیات عادی Qbit به‌صورت **typed remote operation** ایجاد می‌شود؛ مرورگر فرمان raw shell یا raw Docker command ارسال نمی‌کند. هر operation دارای نوع مشخص، شناسه، زمان ایجاد و state پایدار است و نتیجه یا خطای امن آن در تب **عملیات** قابل مشاهده است.

stateهای فعلی عبارت‌اند از:

- `Queued` — در صف؛
- `Running` — در حال اجرا؛
- `Succeeded` — موفق؛
- `Failed` — ناموفق؛
- `Cancelled` — لغوشده؛
- `Timed out` — زمان عملیات تمام شده است.

لغو فقط برای operationهای `Queued` یا `Running` که قبلاً درخواست لغو ندارند در دسترس است. انتخاب **لغو عملیات** یک درخواست cancellation ثبت می‌کند؛ ممکن است تا پردازش آن، state نهایی فوراً تغییر نکند.

## دریافت متریک تازه

صفحه‌های snapshot و history همچنان passive هستند: بازکردن آن‌ها یا عوض‌کردن بازه زمانی هیچ polling یا command تازه‌ای ایجاد نمی‌کند.

اما در تب **مانیتورینگ**، دکمه **دریافت متریک تازه** یک اقدام صریح است. اگر سرور capability `monitor` را داشته باشد، Qbit یک typed operation برای جمع‌آوری تازه متریک‌ها ایجاد می‌کند. وضعیت این operation در همان UI و تاریخچه عملیات قابل پیگیری است.

برای تفاوت snapshot، history و stale data، [مانیتورینگ منابع](/guide/monitoring) را ببینید.

## کانتینرهای Docker

تب **کانتینرها** فقط projection امن کانتینرهای سرور انتخاب‌شده و actionهای allow-listed فعلی را نمایش می‌دهد. در نسخه فعلی Console:

- کانتینر `running`، `paused` یا `restarting`: **توقف** و **راه‌اندازی مجدد**؛
- کانتینر `created` یا `exited`: **شروع** و **راه‌اندازی مجدد**؛
- کانتینر `dead` یا `unknown`: action lifecycle از UI ارائه نمی‌شود.

قبل از action، confirmation نمایش داده می‌شود. تأیید action یک typed operation می‌سازد؛ مرورگر raw Docker command ارسال نمی‌کند.

:::info
قابلیت‌های application deployment، Compose و database workload در این راهنما operational فرض نشده‌اند. فقط behavior فعلی merge‌شده‌ی سرور/کانتینر مستند شده است.
:::

## ترمینال سطح‌بالا

ترمینال یک سطح **مجزا و privileged** از typed automation است. وقتی capability `terminal` موجود باشد می‌توانید نشست کوتاه‌عمر ایجاد کنید، اندازه ترمینال را تغییر دهید، ورودی بفرستید و صریحاً disconnect کنید.

محدوده اندازه فعلی UI:

- ستون‌ها: ۲۰ تا ۴۰۰؛
- ردیف‌ها: ۱۰ تا ۲۰۰.

رفتار فعلی Agent برای PTY محلی به‌طور پیش‌فرض:

- نشست بدون فعالیت را پس از ۱۰ دقیقه می‌بندد؛
- عمر PTY را حداکثر ۳۰ دقیقه نگه می‌دارد؛
- expiry صادرشده توسط control plane می‌تواند نشست را زودتر پایان دهد.

این مقادیر **default فعلی runtime** هستند، نه وعده دائمی قرارداد. اگر نشست منقضی یا قطع شد، برای اتصال مجدد یک نشست جدید بسازید.

### امنیت و audit ترمینال

- مرورگر credential ماشین Agent، private key SSH یا ticket یک‌بارمصرف WebSocket را نمایش نمی‌دهد؛
- bytes ترمینال موقتی هستند و در query cache کنسول ذخیره نمی‌شوند؛
- audit مسیر ساخت نشست metadata sanitize‌شده مانند tenant، actor، server، correlation و شناسه نشست را ثبت می‌کند؛
- ورودی/خروجی ترمینال، command output، credential و ticket محرمانه جزو payload مجاز audit نیستند.

:::danger
ترمینال برای troubleshooting سرور مشتری است و می‌تواند تغییرات واقعی روی همان ماشین ایجاد کند. قبل از اجرای فرمان، scope سرور و Workspace را بررسی کنید. ترمینال میزبان‌ها/کانتینرهای داخلی Qbit در این Console ارائه نمی‌شود؛ عملیات داخلی Qbit در plane مستقل Dokploy انجام می‌شود.
:::

## بعد از خطا چه چیزی را بررسی کنم؟

- `Unavailable`: وضعیت اتصال Agent/سرور را بررسی کنید؛
- capability missing: Agent/نسخه و capabilityهای اعلام‌شده را بررسی کنید؛
- `Failed` یا `Timed out`: نتیجه امن operation و correlation ID را برای troubleshooting نگه دارید؛
- `Cancel requested`: منتظر state نهایی operation بمانید؛
- terminal expired/disconnected: نشست جدید بسازید؛
- هرگز password، token، private key، WebSocket ticket یا secret را در گزارش پشتیبانی ارسال نکنید.

صفحه مرتبط: [رفع اشکال](/guide/troubleshooting) و [امنیت](/guide/security).
