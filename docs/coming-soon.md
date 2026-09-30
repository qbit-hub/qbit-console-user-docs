# قابلیت‌های به‌زودی

Qbit Console بعضی areaهای آینده را در navigation نگه می‌دارد تا جهت محصول روشن باشد، اما وجود یک صفحه رزروشده به معنی operational بودن یک محصول مستقل نیست.

## موارد فعلی Preview

این قابلیت‌ها در Phase 1 هنوز **غیرفعال / Coming soon** هستند:

- Qbit Cloud compute و خرید سرور میزبانی‌شده توسط Qbit؛
- محصول مستقل managed database خارج از چرخه Workloads؛
- catalog مستقل Template خارج از sourceهای فعلی Workloads؛
- اتصال حساب‌های Git provider به‌صورت managed provider integration؛
- Backup service؛
- DNS managed service؛
- Push notification service؛
- Container Registry میزبانی‌شده توسط Qbit؛
- npm cache میزبانی‌شده؛
- Wallet؛
- hourly hosting metering.

:::info
**Workloads** دیگر preview نیست. چرخه ساخت، validate، deploy، history/log، stop/delete و recovery برای workloadهای merge‌شده روی سرورهای ریموت متعلق به مشتری عملیاتی است. این راهنما فعلاً workflow مبتنی بر Container image را در [انتشار ورک‌لود با ایمیج](/guide/workload-deployment) مستند می‌کند.
:::

گزینه‌های source مانند Compose، Git و database template که داخل Workloads نمایش داده می‌شوند بخشی از همان مدل واحد Workload هستند؛ آن‌ها را با محصولات مستقل preview مانند managed database، template catalog یا Git-provider account integration یکی ندانید.

## چرا بعضی صفحات هنوز نمایش داده می‌شوند؟

صفحات رزروشده برای مشخص‌کردن information architecture آینده وجود دارند. آن‌ها نباید endpoint جعلی، resource billable یا mutation ساختگی ایجاد کنند.

## قابلیت‌های فعال فعلی

برای کارهای عملیاتی از بخش‌های فعال استفاده کنید:

- Workspace و membership؛
- Remote server inventory؛
- عملیات ریموت تایپ‌شده و ترمینال مجاز؛
- Passive resource monitoring و history؛
- Resource alerts و notification destinationهای فعال؛
- Workloads روی سرورهای ریموت متعلق به مشتری؛
- Read-only billing visibility؛
- Panel preferences و account sessions.

:::warning
برای قابلیت‌هایی که همچنان **به‌زودی** هستند، تا زمانی که workflow واقعی آن‌ها merge و در Console فعال نشده است برنامه‌ریزی production انجام ندهید.
:::
