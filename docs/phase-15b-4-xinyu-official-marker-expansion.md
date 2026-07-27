# Phase 15B-4 Xinyu Official Marker Expansion

## Status and scope

This bounded implementation adds four reviewed Xinyu provincial protected-heritage Points to the existing official publication pipeline. Together with 新余孔庙, the generated official layer contains five public features from fifteen joined official records and retains ten exclusions.

It does not add official category filters, area or line geometry, national/city/county records, or community-data behavior.

## Official source

- Title: 新余市市级以上文物保护单位名录（2025年）
- Issuing authority: 新余市文化广电旅游局
- Publication date: 2025-12-26
- Source access date: 2026-07-24
- Source: <https://wxj.xinyu.gov.cn/wxj/qtygwjfsh/2025-12/26/content_8c20af69612748c0ac4570ce91627770.shtml>

The source sequence is retained only as source order. It is not a formal designation number.

## Approved records and reviewed Points

| Record ID | Official name | Official category and locality | Gaode POI and original GCJ-02 audit value | Published WGS84 Point | Meaning | Uncertainty |
| --- | --- | --- | --- | --- | --- | ---: |
| `JX-XY-PCH-008` | 昼锦堂 | 古建筑; 仙女湖区观巢镇汉泉村 | `B0IRN5X33Z`; `[114.845605, 27.851425]` | `[114.840705, 27.854836]` | Visitor reference | 125 m |
| `JX-XY-PCH-009` | 蓉泉桥 | 古建筑; 渝水区水北镇排江村 | `B0JU95B3WN`; `[115.052627, 28.070835]` | `[115.047377, 28.074011]` | Approximate heritage-feature Point | 75 m |
| `JX-XY-PCH-014` | 傅抱石故居 | 近现代重要史迹; 渝水区罗坊镇章塘村 | `B0FFJ6C27Y`; `[115.098417, 27.908861]` | `[115.093120, 27.911966]` | Visitor reference | 100 m |
| `JX-XY-PCH-016` | 上海劳动妇女战地服务团旧址 | 近现代重要史迹; 渝水区珠珊镇沙头村 | `B0IATLWGUH`; `[114.977746, 27.770564]` | `[114.972780, 27.773914]` | Visitor reference | 100 m |

All four decisions are approximate, have no generalization radius, and are assessed as acceptable for public display. The visitor-reference decisions do not claim to locate the protected feature itself. 蓉泉桥 is a reviewed approximate site Point, not an exact Point.

## Evidence and reconciliation

The final review checked each official name, category, locality, provider POI identity, address, photograph where present, and same-name risk against the official register and an independent institutional description. Xinyu Museum supplies the independent descriptions for 昼锦堂, 蓉泉桥, and 傅抱石故居. The Xinyu Women's Federation description supplies the independent visitor-venue context for 上海劳动妇女战地服务团旧址.

Gaode coordinates are retained as reviewer evidence in GCJ-02 and never copied to the public GeoJSON as WGS84. The deterministic comparison uses the standard iterative inverse GCJ-02 transform with Krasovsky 1940 constants `a=6378245.0` and `ee=0.00669342162296594323`, applying ten forward-transform residual iterations. Each result was then reviewed in independent WGS84 basemap and imagery context against the stated locality. The full source list, provider URL, identity/locality reasoning, reviewer status, and transformation note remain in the private-to-project decision dataset rather than the generated public properties.

The Shanghai POI requires a specific provenance note. The bounded audit captured `[114.978214, 27.769586]` GCJ-02. On 2026-07-27, the same POI ID, name, venue photograph, and Hengbanqiao address rendered at `[114.977746, 27.770564]` GCJ-02. The structured original-provider field records that current pin. The published WGS84 Point uses its inverse, `[114.972780, 27.773914]`; the earlier audit coordinate and preliminary WGS84 candidate remain reviewer evidence only and were not published.

## Public wording

Visitor-reference popups state:

> Visitor reference point
>
> This marker shows a public visitor reference associated with the official heritage record. It may not coincide with the protected feature itself. The location was produced by Alex’s Photo Board and is not an official designation coordinate or legal boundary.

The 蓉泉桥 popup states:

> Approximate site location
>
> This official heritage record has a project-reviewed approximate feature location. The displayed point was produced by Alex’s Photo Board; it is not an official designation coordinate or legal boundary.

Every generated feature keeps official Chinese facts, the project English interpretation, official source provenance, Point meaning, and uncertainty separate. Reviewer-only provider and identity evidence is excluded from public GeoJSON.

## Deferred records

No Point decision was added for 棋盘山遗址, 袁州明代城墙砖窑址群（芦塘窑址）, 彭家山遗址, 斜里遗址, 北伐军仰天岗战场遗址, 下保农民暴动旧址, or 打鼓岭遗址. They remain deferred for later area, line, component, or locality-resolution work. No Group B candidate was substituted.

## Generated result

- Joined official records: 15
- Public features: 5
- Exclusions: 10
- Hard errors: 0
- Generation status: `valid`

These are project-produced public reference locations. They are not official designation coordinates, protection extents, legal boundaries, or substitutes for the issuing authority's records.
