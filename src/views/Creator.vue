<template>
  <div
      class="flex flex-col h-full"
  >
    <div
        :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'border border-gray-200 bg-white text-gray-800'"
        class="flex flex-col gap-8 relative w-full overflow-x-auto duration-300 transition-all m-10 rounded-xl p-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-xl font-bold">Table content</span>
        <div class="flex items-center gap-2">
          <div class="flex items-center border border-gray-600 rounded-md px-2">
            <i class="fa-solid fa-magnifying-glass text-sm border-r border-gray-400 pr-2 text-gray-400"></i>
            <input class="outline-none px-2 py-1" placeholder="Search..." v-model="searchItem" type="search">
          </div>
          <CButton
              type="button"
              text="Add"
              variant="primary"
              @click="addForm"
          />
        </div>
      </div>
      <CDialog
          :show="deleteRowItem"
          @close="deleteRowItem = false"
          bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
      >
        <DeleteConfirm title="Ushbu itemni uchirmoqchimisiz?"
                       v-model:show="deleteRowItem"
                       @confirm="handleDeleteItem"
        />
      </CDialog>
      <div
          class="shadow-xl flex flex-col justify-between overflow-x-auto rounded-xl p-4 border"
          :class="themeStore.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'"
      >
        <DataTable
            :rowClass="rowClass"
            :value="filteredItems"
            tableStyle="w-100%"
            class="min-h-[100px] flex gap-4"
        >
          <Column
              v-for="(col, index) of columns" :key="index" :field="col.field" :header="col.header"
          >
            <template v-if="col.field === 'imageUrl'" #body="{ data }">
              <Image
                  preview
                  :src="getImage(data.imageUrl)"
                  class="w-[50px] p-1 items-center flex object-cover h-15"
              >
                <template #preview="slotProps">
                  <img
                      alt="preview"
                      :src="data.imageUrl"
                      class="rounded-2xl max-w-[1500px] max-h-[800px]"
                      :style="slotProps.style"
                      @click="slotProps.onClick"
                  />
                </template>
              </Image>

            </template>
            <template v-if="col.field === 'price'" #body="{ data }">
              {{data.price}} so'm
            </template>
          </Column>
          <Column header="Actions" class="w-[100px]">
            <template #body="slotProps">
              <div class="flex gap-2">
                <button
                    @click="editRow(slotProps.data)"
                    class="bg-blue-500 cursor-pointer text-white m-2 px-3 rounded"
                >
                  Edit
                </button>
                <button
                    @click="deleteRow(slotProps.data)"
                    class="bg-red-500 cursor-pointer text-white m-2 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <CDialog
          v-model:show="visibleForm"
          has-close-icon
          @close="visibleForm = false"
          bodyClass="rounded-lg p-4 bg-bg-primary"
      >
        <div
            class="flex items-center justify-center p-4">
          <form
              :class="themeStore.theme === 'dark' ? 'text-white' : 'text-gray-800'"
              class="flex flex-col gap-4 w-full  rounded text-black"
              @submit.prevent="formSubmit"
          >
            <h2 class="text-2xl font-medium">Form title</h2>
            <AppInput label="Image"
                      type="file"
                      @change="fileChange($event)"
            />
            <AppInput
                type="text"
                placeholder="Enter Product Name"
                v-model="form.name"
                label="Name"
                name="name"
            />
            <AppInput
                type="text"
                placeholder="Enter Product number"
                label="Product number"
                v-model="form.number"
            />
            <AppInput
                type="date"
                label="Date"
                v-model="form.date"
            />
            <AppInput
                type="text"
                placeholder="Enter price"
                label="Price"
                v-model="form.price"
            />

            <div class="flex w-full justify-end gap-2">
              <CButton
                  type="button"
                  text="Cancel"
                  variant="ghost-accent"
                  @click="formCancel()"
              />
              <CButton
                  type="submit"
                  text="Submit"
                  variant="primary"
              />
            </div>
          </form>
        </div>
      </CDialog>
    </div>
    <div class="">
      <!-- Header -->
      <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-industry text-3xl"></i>
              <div>
                <h1 class="text-2xl font-bold">Ishlab Chiqarish Tizimi</h1>
                <p class="text-sm text-blue-100">Buyurtma va xodimlar boshqaruvi</p>
              </div>
            </div>
            <div class="flex gap-4">
              <button onclick="showTab('dashboard')" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                <i class="fas fa-home mr-2"></i>Dashboard
              </button>
              <button onclick="showTab('orders')" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                <i class="fas fa-shopping-cart mr-2"></i>Buyurtmalar
              </button>
              <button onclick="showTab('employees')" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                <i class="fas fa-users mr-2"></i>Xodimlar
              </button>
              <button onclick="showTab('materials')" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                <i class="fas fa-boxes mr-2"></i>Xom ashyo
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-4 py-8">
        <!-- Dashboard Tab -->
        <div id="dashboard-tab" class="tab-content">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm">Jami Buyurtmalar</p>
                  <p class="text-3xl font-bold text-blue-600" id="total-orders">0</p>
                </div>
                <i class="fas fa-shopping-cart text-4xl text-blue-200"></i>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm">Jarayonda</p>
                  <p class="text-3xl font-bold text-yellow-600" id="pending-orders">0</p>
                </div>
                <i class="fas fa-clock text-4xl text-yellow-200"></i>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm">Bajarilgan</p>
                  <p class="text-3xl font-bold text-green-600" id="completed-orders">0</p>
                </div>
                <i class="fas fa-check-circle text-4xl text-green-200"></i>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm">Xodimlar</p>
                  <p class="text-3xl font-bold text-purple-600" id="total-employees">10</p>
                </div>
                <i class="fas fa-users text-4xl text-purple-200"></i>
              </div>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4">So'nggi Buyurtmalar</h2>
            <div id="recent-orders" class="space-y-3"></div>
          </div>
        </div>

        <!-- Orders Tab -->
        <div id="orders-tab" class="tab-content hidden">
          <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Buyurtmalar Ro'yxati</h2>
              <button onclick="openOrderModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                <i class="fas fa-plus mr-2"></i>Yangi Buyurtma
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">№</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Buyurtma</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mas'ul</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Muddat</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Holat</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amallar</th>
                </tr>
                </thead>
                <tbody id="orders-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Employees Tab -->
        <div id="employees-tab" class="tab-content hidden">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-6">Xodimlar Ro'yxati</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="employees-list"></div>
          </div>
        </div>

        <!-- Materials Tab -->
        <div id="materials-tab" class="tab-content hidden">
          <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Xom Ashyo Ombori</h2>
              <button onclick="openMaterialModal()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                <i class="fas fa-plus mr-2"></i>Qo'shish
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="materials-list"></div>
          </div>
        </div>
      </main>

      <!-- Order Modal -->
      <div id="order-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold" id="order-modal-title">Yangi Buyurtma</h3>
            <button onclick="closeOrderModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <form id="order-form" class="space-y-4">
            <input type="hidden" id="order-id">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Buyurtma Nomi</label>
              <input type="text" id="order-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Buyurtma Turi</label>
              <select id="order-type" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tanlang</option>
                <option value="Mebel">Mebel</option>
                <option value="Metall konstruksiya">Metall konstruksiya</option>
                <option value="Plastik mahsulot">Plastik mahsulot</option>
                <option value="Boshqa">Boshqa</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mas'ul Xodim</label>
              <select id="order-employee" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tanlang</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tugash Sanasi</label>
              <input type="date" id="order-deadline" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Holat</label>
              <select id="order-status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="pending">Kutilmoqda</option>
                <option value="in-progress">Jarayonda</option>
                <option value="completed">Bajarilgan</option>
              </select>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Saqlash
              </button>
              <button type="button" onclick="closeOrderModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition">
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Material Modal -->
      <div id="material-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold">Xom Ashyo Qo'shish</h3>
            <button onclick="closeMaterialModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <form id="material-form" class="space-y-4">
            <input type="hidden" id="material-id">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nomi</label>
              <input type="text" id="material-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Miqdori</label>
              <input type="number" id="material-quantity" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">O'lchov Birligi</label>
              <select id="material-unit" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="kg">kg</option>
                <option value="dona">dona</option>
                <option value="metr">metr</option>
                <option value="litr">litr</option>
              </select>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Saqlash
              </button>
              <button type="button" onclick="closeMaterialModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition">
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
// Initial Data
const employees = [
  { id: 1, name: 'Aliyev Sardor', position: 'Usta', phone: '+998 90 123 45 67', status: 'active' },
  { id: 2, name: 'Karimov Javohir', position: 'Yordamchi', phone: '+998 91 234 56 78', status: 'active' },
  { id: 3, name: 'Toshmatov Bekzod', position: 'Payvandchi', phone: '+998 93 345 67 89', status: 'active' },
  { id: 4, name: 'Rahimov Otabek', position: 'Usta', phone: '+998 94 456 78 90', status: 'active' },
  { id: 5, name: 'Mahmudov Dilshod', position: 'Bo\'yoqchi', phone: '+998 95 567 89 01', status: 'active' },
  { id: 6, name: 'Yusupov Farrux', position: 'Yordamchi', phone: '+998 97 678 90 12', status: 'active' },
  { id: 7, name: 'Abdullayev Jamshid', position: 'Omborchi', phone: '+998 98 789 01 23', status: 'active' },
  { id: 8, name: 'Nazarov Sherzod', position: 'Haydovchi', phone: '+998 99 890 12 34', status: 'active' },
  { id: 9, name: 'Ismoilov Aziz', position: 'Usta', phone: '+998 90 901 23 45', status: 'active' },
  { id: 10, name: 'Mirzoev Rustam', position: 'Yordamchi', phone: '+998 91 012 34 56', status: 'active' }
];

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let materials = JSON.parse(localStorage.getItem('materials')) || [
  { id: 1, name: 'Metall profil', quantity: 150, unit: 'kg' },
  { id: 2, name: 'Yog\'och taxta', quantity: 45, unit: 'dona' },
  { id: 3, name: 'Bo\'yoq', quantity: 25, unit: 'litr' }
];

// Save to LocalStorage
function saveData() {
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('materials', JSON.stringify(materials));
}

// Tab Management
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabName + '-tab').classList.remove('hidden');

  if (tabName === 'dashboard') updateDashboard();
  if (tabName === 'orders') renderOrders();
  if (tabName === 'employees') renderEmployees();
  if (tabName === 'materials') renderMaterials();
}

// Dashboard
function updateDashboard() {
  const total = orders.length;
  const pending = orders.filter(o => o.status === 'pending' || o.status === 'in-progress').length;
  const completed = orders.filter(o => o.status === 'completed').length;

  document.getElementById('total-orders').textContent = total;
  document.getElementById('pending-orders').textContent = pending;
  document.getElementById('completed-orders').textContent = completed;

  const recentOrders = orders.slice(-5).reverse();
  document.getElementById('recent-orders').innerHTML = recentOrders.map(order => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div class="flex-1">
                        <p class="font-semibold">${order.name}</p>
                        <p class="text-sm text-gray-600">${order.type} - ${order.employee}</p>
                    </div>
                    <div class="text-right">
                        <span class="px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}">${getStatusText(order.status)}</span>
                        <p class="text-sm text-gray-500 mt-1">${order.deadline}</p>
                    </div>
                </div>
            `).join('');
}

// Orders
function renderOrders() {
  const tbody = document.getElementById('orders-table-body');
  tbody.innerHTML = orders.map((order, index) => `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="px-4 py-3">${index + 1}</td>
                    <td class="px-4 py-3">
                        <div class="font-semibold">${order.name}</div>
                        <div class="text-sm text-gray-500">${order.type}</div>
                    </td>
                    <td class="px-4 py-3">${order.employee}</td>
                    <td class="px-4 py-3">${order.deadline}</td>
                    <td class="px-4 py-3">
                        <span class="px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}">${getStatusText(order.status)}</span>
                    </td>
                    <td class="px-4 py-3">
                        <button onclick="editOrder(${order.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteOrder(${order.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
}

function openOrderModal(id = null) {
  const modal = document.getElementById('order-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  const employeeSelect = document.getElementById('order-employee');
  employeeSelect.innerHTML = '<option value="">Tanlang</option>' +
      employees.map(emp => `<option value="${emp.name}">${emp.name} - ${emp.position}</option>`).join('');

  if (id) {
    const order = orders.find(o => o.id === id);
    document.getElementById('order-modal-title').textContent = 'Buyurtmani Tahrirlash';
    document.getElementById('order-id').value = order.id;
    document.getElementById('order-name').value = order.name;
    document.getElementById('order-type').value = order.type;
    document.getElementById('order-employee').value = order.employee;
    document.getElementById('order-deadline').value = order.deadline;
    document.getElementById('order-status').value = order.status;
  } else {
    document.getElementById('order-modal-title').textContent = 'Yangi Buyurtma';
    document.getElementById('order-form').reset();
    document.getElementById('order-status').value = 'pending';
  }
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.add('hidden');
  document.getElementById('order-form').reset();
}

// document.getElementById('order-form').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const id = document.getElementById('order-id').value;
//   const orderData = {
//     id: id ? parseInt(id) : Date.now(),
//     name: document.getElementById('order-name').value,
//     type: document.getElementById('order-type').value,
//     employee: document.getElementById('order-employee').value,
//     deadline: document.getElementById('order-deadline').value,
//     status: document.getElementById('order-status').value
//   };
//
//   if (id) {
//     const index = orders.findIndex(o => o.id === parseInt(id));
//     orders[index] = orderData;
//   } else {
//     orders.push(orderData);
//   }
//
//   saveData();
//   closeOrderModal();
//   renderOrders();
//   updateDashboard();
// });

function editOrder(id) {
  openOrderModal(id);
}

function deleteOrder(id) {
  if (confirm('Buyurtmani o\'chirmoqchimisiz?')) {
    orders = orders.filter(o => o.id !== id);
    saveData();
    renderOrders();
    updateDashboard();
  }
}

// Employees
function renderEmployees() {
  document.getElementById('employees-list').innerHTML = employees.map(emp => `
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            ${emp.name.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">${emp.name}</h3>
                            <p class="text-sm text-gray-600">${emp.position}</p>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <p class="flex items-center gap-2">
                            <i class="fas fa-phone text-blue-600"></i>
                            ${emp.phone}
                        </p>
                        <p class="flex items-center gap-2">
                            <i class="fas fa-tasks text-green-600"></i>
                            Topshiriqlar: ${orders.filter(o => o.employee === emp.name).length}
                        </p>
                    </div>
                </div>
            `).join('');
}

// Materials
function renderMaterials() {
  document.getElementById('materials-list').innerHTML = materials.map(mat => `
                <div class="bg-white p-6 rounded-xl shadow-md border-l-4 ${mat.quantity < 30 ? 'border-red-500' : 'border-green-500'}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-lg">${mat.name}</h3>
                            <p class="text-3xl font-bold ${mat.quantity < 30 ? 'text-red-600' : 'text-green-600'} mt-2">
                                ${mat.quantity} ${mat.unit}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="editMaterial(${mat.id})" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteMaterial(${mat.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${mat.quantity < 30 ? '<p class="text-red-500 text-sm"><i class="fas fa-exclamation-triangle mr-1"></i>Kam qoldi!</p>' : ''}
                </div>
            `).join('');
}

function openMaterialModal(id = null) {
  const modal = document.getElementById('material-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (id) {
    const material = materials.find(m => m.id === id);
    document.getElementById('material-id').value = material.id;
    document.getElementById('material-name').value = material.name;
    document.getElementById('material-quantity').value = material.quantity;
    document.getElementById('material-unit').value = material.unit;
  } else {
    document.getElementById('material-form').reset();
  }
}

function closeMaterialModal() {
  document.getElementById('material-modal').classList.add('hidden');
  document.getElementById('material-form').reset();
}

// document.getElementById('material-form').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const id = document.getElementById('material-id').value;
//   const materialData = {
//     id: id ? parseInt(id) : Date.now(),
//     name: document.getElementById('material-name').value,
//     quantity: parseInt(document.getElementById('material-quantity').value),
//     unit: document.getElementById('material-unit').value
//   };
//
//   if (id) {
//     const index = materials.findIndex(m => m.id === parseInt(id));
//     materials[index] = materialData;
//   } else {
//     materials.push(materialData);
//   }
//
//   saveData();
//   closeMaterialModal();
//   renderMaterials();
// });

function editMaterial(id) {
  openMaterialModal(id);
}

function deleteMaterial(id) {
  if (confirm('Xom ashyoni o\'chirmoqchimisiz?')) {
    materials = materials.filter(m => m.id !== id);
    saveData();
    renderMaterials();
  }
}

// Helper Functions
function getStatusColor(status) {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  };
  return colors[status] || colors.pending;
}

function getStatusText(status) {
  const texts = {
    'pending': 'Kutilmoqda',
    'in-progress': 'Jarayonda',
    'completed': 'Bajarilgan'
  };
  return texts[status] || texts.pending;
}

// Initialize
// updateDashboard();
</script>
<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {computed, ref} from "vue";
import { useStore } from "@/stores/index.ts";
import { useToast } from "vue-toastification";
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import Image from 'primevue/image'

import img from '@/assets/images/img.jpg'
import img2 from '@/assets/images/img2.jpg'
import img3 from '@/assets/images/img3.jpg'
import img4 from '@/assets/images/img4.jpg'
import img5 from '@/assets/images/img5.jpg'
import img6 from '@/assets/images/img6.jpg'

const Toast = useToast();
const themeStore = useStore();
const visibleForm = ref(false);
const selectedForm = ref('');
const deleteRowItem = ref(false);
const deleteId = ref(null);

const searchItem = ref('');

const filteredItems = computed(() => {
  const term = searchItem.value.toLowerCase();
  return products.value.filter(item =>
      item.name.toLowerCase().includes(term) ||
      String(item.number).toLowerCase().includes(term) ||
      item.date.toLowerCase().includes(term) ||
      String(item.price).toLowerCase().includes(term)
  );
})


const addForm = () => {
  visibleForm.value = true;
  resetForm()
}

const rowClass = () => {
  return themeStore.theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-200',
      'table-row-hover';
};

const editRow = (data) => {
  selectedForm.value = data;
  form.value = selectedForm.value;
  visibleForm.value = true;
}
const formSubmit = () => {
  const index = products.value.findIndex(p => p.id === form.value.id);
  if (selectedForm.value) {
    products.value[index] = {
      ...form.value,
    };
    Toast.success("Successfully changed!");
  } else {
    const idLength = products.value.length ? Math.max(...products.value.map(item => item.id)) : 0;
    form.value.id = idLength + 1;
    products.value.push(form.value);
    Toast.success("Added successfully!");
  }
  visibleForm.value = false;
  selectedForm.value = null;
  resetForm();
}
const formCancel = () => {
  visibleForm.value = false;
  resetForm();
}

const handleDeleteItem = () => {
  const index = products.value.findIndex(p => p.id === deleteId.value);
  products.value.splice(index, 1);
  Toast.info("Successfully deleted!");
  deleteRowItem.value = false;
}

const deleteRow = (data) => {
  deleteRowItem.value = true;
  deleteId.value = data.id;
}

const getImage = (file) => {
  if (!file) return "";
  if (typeof file === "string") return file; // oldin saqlangan bo‘lsa
  return URL.createObjectURL(file); // File → blob url
};

const fileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    form.value.imageUrl = file;
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    imageUrl: null,
    name: "",
    number: "",
    date: "",
    price: "",
  };
}
const form = ref({
  id: null,
  imageUrl: null,
  name: "",
  number: "",
  date: "",
  price: "",
})

const columns = ref([
  {
    field: "id",
    header: "ID",
  },
  {
    field: "imageUrl",
    header: "Image",
  },
  {
    field: "name",
    header: "Name",
  },
  {
    field: "number",
    header: "Number",
  },
  {
    field: "date",
    header: "Date",
  },
  {
    field: "price",
    header: "Price",
  }
])

const products = ref([
  {
    id: 1,
    imageUrl: img || "",
    name: "Product 1",
    number: 11,
    date: "2.12.2025",
    price: "4000"
  },
  {
    id: 2,
    imageUrl: img2 || "",
    name: "Product 2",
    number: 22,
    date: "4.12.2025",
    price: "2000"
  },
  {
    id: 3,
    imageUrl: img3 || "",
    name: "Product 3",
    number: 32,
    date: "3.11.2025",
    price: "5000"
  },
  {
    id: 4,
    imageUrl: img4 || "",
    name: "Product 4",
    number: 42,
    date: "1.12.2025",
    price: "5500"
  },
  {
    id: 5,
    imageUrl: img5 || "",
    name: "Product 5",
    number: 55,
    date: "2.12.2025",
    price: "2000"
  },
  {
    id: 6,
    imageUrl: img6 || "",
    name: "Product 6",
    number: 62,
    date: "52.12.2025",
    price: "5000"
  }
])
</script>


<style>
.table-row-hover:hover {
  background-color: #3e3a3a !important;
}
</style>