# FE Agent Charter — Responsibility Boundaries

## 1. Mục tiêu (Goal)

Build một AI coding agent cho FrontEnd (FE Agent) có khả năng:
- **Tự động triển khai UI flow** từ Acceptance Criteria (AC) sang Vue 3 component code.
- **Duy trì chất lượng** về responsive, accessibility (a11y), và maintainability theo nguyên lý SOLID.
- **Tích hợp API** an toàn và nhất quán với backend (REST) và MCP server.

---

## 2. Phạm vi trách nhiệm (Responsibility Boundaries)

### 2.1 Trong phạm vi (In-scope)

| Hạng mục | Mô tả |
|---|---|
| **Vue 3 UI** | Tạo, sửa, xóa `.vue` SFC component tuân theo Composition API + `<script setup>` |
| **State Management** | Viết Vue composables (`use*.ts`) để quản lý local/shared state |
| **API Integration** | Gọi REST API qua service layer (`src/services/`), xử lý lỗi thống nhất |
| **MCP Integration** | Tích hợp Model Context Protocol qua composable |
| **Responsive & a11y** | Áp dụng CSS responsive, ARIA attributes, semantic HTML |
| **Scaffold** | Tạo cấu trúc thư mục, file mới từ template khi nhận AC mới |
| **Safe Refactor** | Tái cấu trúc code hiện có mà không phá vỡ hành vi (behavior) |
| **Test (BDD)** | Viết Playwright E2E test theo BDD scenario cho luồng người dùng chính |

### 2.2 Ngoài phạm vi (Out-of-scope)

| Hạng mục | Lý do |
|---|---|
| **Backend logic** | Thuộc BE Agent (Node/Express/Prisma) |
| **DB migration** | Thuộc BE Agent |
| **MCP server implementation** | Thuộc MCP Agent |
| **Infrastructure / DevOps** | Thuộc Infra Agent |
| **Design system creation** | FE Agent dùng design token, không tạo từ đầu |

---

## 3. Kiến trúc mục tiêu (Target Architecture)

```
frontend/src/
├── components/          # Presentational Vue SFC components
│   ├── ItemForm.vue     #   Form input: thêm item mới
│   ├── ItemList.vue     #   Danh sách items + toggle + xóa
│   └── McpTrigger.vue   #   Kích hoạt MCP và hiển thị kết quả
├── composables/         # Business logic / state hooks
│   ├── useItems.ts      #   CRUD state cho items (gọi itemsService)
│   └── useMcp.ts        #   Gọi MCP context endpoint
├── services/            # API integration layer (axios wrappers)
│   └── itemsService.ts  #   REST /api/items
├── App.vue              # Root component — chỉ compose, không có logic
└── main.ts              # App bootstrap
```

### Nguyên tắc thiết kế (SOLID applied to Vue)

| Nguyên lý | Áp dụng |
|---|---|
| **SRP** | Mỗi composable / service chịu trách nhiệm một domain duy nhất |
| **OCP** | Component nhận props/slots để mở rộng không sửa code |
| **LSP** | Composable trả về interface nhất quán, thay thế được |
| **ISP** | Service chỉ expose method mà caller cần |
| **DIP** | Component phụ thuộc composable (abstraction), không gọi axios trực tiếp |

---

## 4. Skills theo Workflow

### Workflow A — Scaffold từ AC
```
Input : Acceptance Criteria (AC) dạng text
Output: Cấu trúc file .vue + composable + service + Playwright spec
Steps :
  1. Parse AC → xác định entities, actions, UI states
  2. Tạo service layer cho entity
  3. Tạo composable bọc service
  4. Tạo component(s) dùng composable
  5. Tạo BDD spec cho luồng chính
```

### Workflow B — Tích hợp API mới
```
Input : Spec API endpoint mới (method, path, payload, response)
Output: Cập nhật service + composable + component hiển thị
Steps :
  1. Thêm function vào service tương ứng
  2. Cập nhật composable expose action mới
  3. Bind action vào component / template
  4. Thêm test case Playwright cho happy path + error path
```

### Workflow C — Safe Refactor
```
Input : Chỉ định file/component cần tái cấu trúc
Output: Code được tái cấu trúc, test vẫn pass
Steps :
  1. Chạy test hiện tại → baseline pass
  2. Tách logic vào composable / service nếu chưa có
  3. Đảm bảo template không thay đổi behavior
  4. Chạy lại test → vẫn pass
```

---

## 5. BDD Scenarios — Luồng người dùng chính

### Feature: Quản lý Items

```gherkin
Feature: Quản lý Items
  Là người dùng
  Tôi muốn quản lý danh sách items
  Để theo dõi công việc của mình

  Scenario: Hiển thị danh sách items khi load trang
    Given trang web đã được mở
    Then tôi thấy danh sách items từ server

  Scenario: Thêm item mới
    Given tôi ở trang chính
    When tôi nhập "Item mới" vào ô nhập liệu
    And tôi nhấn nút "Thêm"
    Then item "Item mới" xuất hiện trong danh sách

  Scenario: Đánh dấu item hoàn thành
    Given có ít nhất một item trong danh sách
    When tôi click vào checkbox của item đó
    Then item đó được hiển thị với gạch ngang (completed)

  Scenario: Xóa item
    Given có ít nhất một item trong danh sách
    When tôi nhấn nút "Xóa" của item đó
    Then item đó biến mất khỏi danh sách

  Scenario: Kích hoạt MCP
    Given tôi ở trang chính
    When tôi nhấn nút "Gọi MCP"
    Then phản hồi JSON từ MCP được hiển thị
```

---

## 6. Định nghĩa Hoàn thành (Definition of Done)

Một task của FE Agent được coi là **Done** khi:

- [ ] Code TypeScript không có lỗi compile (`tsc --noEmit`)
- [ ] Tất cả Playwright E2E tests pass
- [ ] Component không có logic trực tiếp gọi axios (phải qua service/composable)
- [ ] HTML có semantic tags và ARIA attributes cần thiết
- [ ] CSS responsive (mobile-first, ít nhất 2 breakpoint)
- [ ] Không có `any` type trong TypeScript (trừ `shims-vue.d.ts`)
- [ ] Code review bởi BE Agent nếu có thay đổi API contract

---

## 7. Công cụ & Môi trường

| Công cụ | Phiên bản | Mục đích |
|---|---|---|
| Vue | 3.x (Composition API) | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool / dev server |
| Axios | 1.x | HTTP client |
| Playwright | 1.x | E2E testing |
| Proxy `/api` | → `localhost:4000` | Backend REST |
| Proxy `/mcp` | → `localhost:5000` | MCP server |
