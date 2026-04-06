# Analitikai riportálási váz

Ez a projekt a publikus konverziós pontokat már olyan eseményszerkezettel követi, amely GTM és GA4 oldalon is könnyebben használható funnel- és KPI-riportokra.

## Követett publikus események

- `page_view`
- `cta_click`
- `form_started`
- `form_step_completed`
- `service_request_submitted`
- `faq_item_expanded`

## Fő funnel mérföldkövek

- CTA belépési kattintás:
  - `cta_click`
  - `milestone_name = cta_entry_click`
- Szolgáltatásoldal belépés:
  - `page_view`
  - `page_type = service_page`
  - `milestone_name = service_page_entry`
- Űrlapindítás:
  - `form_started`
  - `milestone_name = form_start`
- Űrlaplépés teljesítése:
  - `form_step_completed`
  - `milestone_name = form_step_completed`
- Sikeres beküldés:
  - `service_request_submitted`
  - `milestone_name = service_request_submitted`

## Fontos paraméterek

A főbb eseményekhez ezek a dimenziók társulnak:

- `platform_area`
- `event_version`
- `page_name`
- `page_type`
- `service_type`
- `source_page`
- `source_section`
- `milestone_name`
- `funnel_stage`
- `form_name`

CTA eseményeknél:

- `cta_variant`
- `cta_label`
- `destination_path`
- `entry_point`

Űrlapeseményeknél:

- `funnel_name`
- `step_index`
- `step_name`
- `next_step_index`
- `next_step_name`
- `total_steps`
- `interacted_field`
- `has_images`

FAQ eseménynél:

- `faq_question`

## Ajánlott GA4 konverziók

Első körben érdemes conversionként kezelni:

- `service_request_submitted`

Másodlagos, megfigyelési célú funnel-események:

- `cta_click`
- `form_started`
- `form_step_completed`

## Ajánlott KPI-k

- Homepage CTA átkattintási arány
- Szolgáltatásoldal belépési arány
- Űrlapindítási arány
- Űrlapbefejezési arány
- Sikeres beküldések száma szolgáltatástípusonként
- FAQ megnyitási arány

## Értelmezési javaslat

- A `cta_click` jól használható belépési pontok összehasonlítására az `entry_point` alapján.
- A `page_view` és a `page_type = service_page` együtt alkalmas a szolgáltatásoldalra érkezések mérésére.
- A `form_started` és a `service_request_submitted` különbsége jól mutatja a funnel lemorzsolódását.
- A `form_step_completed` a `step_name` és `next_step_name` mezőkkel együtt segít azonosítani, melyik konkrét űrlaprész környékén esik vissza a kitöltési arány.
- A `source_page` most már normalizált formában minden fő funnel-eseménynél megjelenik, így könnyebb összevetni a homepage, a szolgáltatásoldalak és az űrlapbelépések teljesítményét.
