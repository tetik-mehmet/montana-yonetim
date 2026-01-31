// Membership Management System - Frontend JavaScript

// Global state
let currentUser = null;
let members = [];
let packages = [];
let memberships = [];

// DOM Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const adminUsername = document.getElementById("adminUsername");

// Toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.className = `show fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transition-all z-50 ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

// API calls
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Bir hata oluştu");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Authentication
async function login(username, password) {
  const data = await apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  currentUser = data.data;
  showDashboard();
  showToast("Giriş başarılı!", "success");
}

async function logout() {
  try {
    await apiCall("/api/auth/logout", { method: "POST" });
    currentUser = null;
    showLogin();
    showToast("Çıkış yapıldı", "info");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function checkAuth() {
  try {
    const data = await apiCall("/api/auth/me");
    currentUser = data.data;
    showDashboard();
  } catch (error) {
    showLogin();
  }
}

// UI Navigation
function showLogin() {
  loginSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
}

function showDashboard() {
  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  adminUsername.textContent = `Hoş geldiniz, ${currentUser.username}`;
  loadMembers();
  loadPackages();
  loadActiveMemberships();
}

// Tab switching
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const tab = e.target.dataset.tab;

    // Update tab buttons
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("border-blue-500", "text-blue-600");
      btn.classList.add("border-transparent", "text-gray-500");
    });
    e.target.classList.remove("border-transparent", "text-gray-500");
    e.target.classList.add("border-blue-500", "text-blue-600");

    // Show selected tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
    });
    document.getElementById(`${tab}Tab`).classList.remove("hidden");

    // Load data for the tab
    if (tab === "members") loadMembers();
    if (tab === "packages") loadPackages();
    if (tab === "memberships") loadMemberships();
    if (tab === "statistics") loadStatistics();
  });
});

// Sub-tab switching (for memberships)
document.querySelectorAll(".subtab-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const subtab = e.target.dataset.subtab;

    // Update subtab buttons
    document.querySelectorAll(".subtab-button").forEach((btn) => {
      btn.classList.remove("border-blue-500", "text-blue-600");
      btn.classList.add("border-transparent", "text-gray-500");
    });
    e.target.classList.remove("border-transparent", "text-gray-500");
    e.target.classList.add("border-blue-500", "text-blue-600");

    // Show selected subtab content
    document.querySelectorAll(".subtab-content").forEach((content) => {
      content.classList.add("hidden");
    });

    if (subtab === "active") {
      document
        .getElementById("activeMembershipsTab")
        .classList.remove("hidden");
      loadActiveMemberships();
    } else {
      document
        .getElementById("expiredMembershipsTab")
        .classList.remove("hidden");
      loadExpiredMemberships();
    }
  });
});

// Members
async function loadMembers() {
  try {
    const data = await apiCall("/api/members");
    members = data.data;
    renderMembers();
    updateMemberDropdown();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderMembers() {
  const tbody = document.getElementById("membersTableBody");

  if (members.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Henüz üye bulunmamaktadır</td></tr>';
    return;
  }

  tbody.innerHTML = members
    .map(
      (member) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${member.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${member.first_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${member.last_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${member.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(member.created_at)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteMember(${member.id})" class="text-red-600 hover:text-red-900">Sil</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

async function deleteMember(id) {
  if (!confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) return;

  try {
    await apiCall(`/api/members/${id}`, { method: "DELETE" });
    showToast("Üye başarıyla silindi", "success");
    loadMembers();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Packages
async function loadPackages() {
  try {
    const data = await apiCall("/api/packages");
    packages = data.data;
    renderPackages();
    updatePackageDropdown();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderPackages() {
  const tbody = document.getElementById("packagesTableBody");

  if (packages.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Henüz paket bulunmamaktadır</td></tr>';
    return;
  }

  tbody.innerHTML = packages
    .map(
      (pkg) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.duration_in_days}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.price} TL</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="openEditPackageModal(${pkg.id})" class="text-blue-600 hover:text-blue-900">Düzenle</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function openEditPackageModal(id) {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return;

  document.getElementById("editPackageId").value = pkg.id;
  document.getElementById("editPackageName").value = pkg.name;
  document.getElementById("editPackageDuration").value = pkg.duration_in_days;
  document.getElementById("editPackagePrice").value = pkg.price;
  document.getElementById("editPackageModal").classList.remove("hidden");
}

function closeEditPackageModal() {
  document.getElementById("editPackageModal").classList.add("hidden");
}

async function updatePackage(id, data) {
  try {
    await apiCall(`/api/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    showToast("Paket başarıyla güncellendi", "success");
    closeEditPackageModal();
    loadPackages();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Memberships
async function loadMemberships() {
  loadActiveMemberships();
  loadExpiredMemberships();
}

async function loadActiveMemberships() {
  try {
    const data = await apiCall("/api/memberships/active");
    renderMemberships(data.data, "activeMembershipsTableBody", false);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function loadExpiredMemberships() {
  try {
    const data = await apiCall("/api/memberships/expired");
    renderMemberships(data.data, "expiredMembershipsTableBody", true);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderMemberships(memberships, tbodyId, showRenewButton) {
  const tbody = document.getElementById(tbodyId);

  if (memberships.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${showRenewButton ? 6 : 5}" class="px-6 py-4 text-center text-gray-500">Üyelik bulunmamaktadır</td></tr>`;
    return;
  }

  tbody.innerHTML = memberships
    .map(
      (m) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${m.first_name} ${m.last_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${m.package_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(m.start_date)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(m.end_date)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${m.status}">${getStatusText(m.status)}</span>
            </td>
            ${
              showRenewButton
                ? `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="renewMembership(${m.member_id})" class="text-green-600 hover:text-green-900">Yenile</button>
                </td>
            `
                : ""
            }
        </tr>
    `,
    )
    .join("");
}

async function assignPackage(memberId, packageId, startDate) {
  try {
    await apiCall("/api/memberships/assign", {
      method: "POST",
      body: JSON.stringify({ memberId, packageId, startDate }),
    });
    showToast("Paket başarıyla atandı", "success");
    loadMemberships();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function renewMembership(memberId) {
  const packageId = prompt("Paket ID giriniz:");
  if (!packageId) return;

  try {
    await apiCall("/api/memberships/renew", {
      method: "POST",
      body: JSON.stringify({
        memberId: parseInt(memberId),
        packageId: parseInt(packageId),
      }),
    });
    showToast("Üyelik başarıyla yenilendi", "success");
    loadMemberships();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR");
}

function getStatusText(status) {
  const statusMap = {
    active: "Aktif",
    expired: "Süresi Dolmuş",
    cancelled: "İptal Edildi",
  };
  return statusMap[status] || status;
}

function updateMemberDropdown() {
  const select = document.getElementById("assignMemberId");
  select.innerHTML =
    '<option value="">Üye Seç</option>' +
    members
      .map(
        (m) =>
          `<option value="${m.id}">${m.first_name} ${m.last_name}</option>`,
      )
      .join("");
}

function updatePackageDropdown() {
  const select = document.getElementById("assignPackageId");
  select.innerHTML =
    '<option value="">Paket Seç</option>' +
    packages
      .map(
        (p) =>
          `<option value="${p.id}">${p.name} (${p.duration_in_days} gün - ${p.price} TL)</option>`,
      )
      .join("");
}

// Event Listeners
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginError = document.getElementById("loginError");

  try {
    await login(username, password);
    loginError.classList.add("hidden");
  } catch (error) {
    loginError.classList.remove("hidden");
    loginError.querySelector("p").textContent = error.message;
  }
});

logoutBtn.addEventListener("click", logout);

// Add member form
document
  .getElementById("addMemberForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("memberFirstName").value;
    const lastName = document.getElementById("memberLastName").value;
    const email = document.getElementById("memberEmail").value;

    try {
      await apiCall("/api/members", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email }),
      });
      showToast("Üye başarıyla eklendi", "success");
      e.target.reset();
      loadMembers();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

// Edit package form
document
  .getElementById("editPackageForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editPackageId").value;
    const name = document.getElementById("editPackageName").value;
    const durationInDays = document.getElementById("editPackageDuration").value;
    const price = document.getElementById("editPackagePrice").value;

    await updatePackage(id, {
      name,
      durationInDays: parseInt(durationInDays),
      price: parseFloat(price),
    });
  });

document
  .getElementById("cancelEditPackage")
  .addEventListener("click", closeEditPackageModal);

// Assign package form
document
  .getElementById("assignPackageForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const memberId = document.getElementById("assignMemberId").value;
    const packageId = document.getElementById("assignPackageId").value;
    const startDate = document.getElementById("assignStartDate").value;

    if (!memberId || !packageId || !startDate) {
      showToast("Lütfen tüm alanları doldurun", "error");
      return;
    }

    await assignPackage(parseInt(memberId), parseInt(packageId), startDate);
    e.target.reset();
  });

// Set default start date to today
document.getElementById("assignStartDate").valueAsDate = new Date();

// Statistics
let chartInstances = {
  packageChart: null,
  statusChart: null,
  monthlyRegistrationsChart: null,
  monthlyMembershipsChart: null,
};

async function loadStatistics() {
  try {
    const data = await apiCall("/api/statistics");
    const stats = data.data;

    // Update summary cards
    document.getElementById("totalMembers").textContent =
      stats.summary.totalMembers;
    document.getElementById("activeMembershipsCount").textContent =
      stats.summary.activeMemberships;
    document.getElementById("expiredMembershipsCount").textContent =
      stats.summary.expiredMemberships;
    document.getElementById("totalMembershipsCount").textContent =
      stats.summary.totalMemberships;

    // Render charts
    renderPackageChart(stats.charts.membershipsByPackage);
    renderStatusChart(stats.charts.membershipsByStatus);
    renderMonthlyRegistrationsChart(stats.charts.monthlyRegistrations);
    renderMonthlyMembershipsChart(stats.charts.monthlyMembershipStarts);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderPackageChart(data) {
  const ctx = document.getElementById("packageChart");

  // Destroy existing chart if exists
  if (chartInstances.packageChart) {
    chartInstances.packageChart.destroy();
  }

  const labels = data.map((item) => item.package_name);
  const values = data.map((item) => parseInt(item.count));

  chartInstances.packageChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Üyelik Sayısı",
          data: values,
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(251, 191, 36, 0.8)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(249, 115, 22, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(236, 72, 153, 1)",
            "rgba(251, 191, 36, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

function renderStatusChart(data) {
  const ctx = document.getElementById("statusChart");

  // Destroy existing chart if exists
  if (chartInstances.statusChart) {
    chartInstances.statusChart.destroy();
  }

  const statusLabels = {
    active: "Aktif",
    expired: "Süresi Dolmuş",
    cancelled: "İptal Edildi",
  };

  const labels = data.map((item) => statusLabels[item.status] || item.status);
  const values = data.map((item) => parseInt(item.count));

  const colors = {
    Aktif: "rgba(16, 185, 129, 0.8)",
    "Süresi Dolmuş": "rgba(239, 68, 68, 0.8)",
    "İptal Edildi": "rgba(156, 163, 175, 0.8)",
  };

  const borderColors = {
    Aktif: "rgba(16, 185, 129, 1)",
    "Süresi Dolmuş": "rgba(239, 68, 68, 1)",
    "İptal Edildi": "rgba(156, 163, 175, 1)",
  };

  chartInstances.statusChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Üyelik Sayısı",
          data: values,
          backgroundColor: labels.map((label) => colors[label]),
          borderColor: labels.map((label) => borderColors[label]),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

function renderMonthlyRegistrationsChart(data) {
  const ctx = document.getElementById("monthlyRegistrationsChart");

  // Destroy existing chart if exists
  if (chartInstances.monthlyRegistrationsChart) {
    chartInstances.monthlyRegistrationsChart.destroy();
  }

  const labels = data.map((item) => {
    const [year, month] = item.month.split("-");
    return `${month}/${year}`;
  });
  const values = data.map((item) => parseInt(item.count));

  chartInstances.monthlyRegistrationsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Yeni Üye Sayısı",
          data: values,
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

function renderMonthlyMembershipsChart(data) {
  const ctx = document.getElementById("monthlyMembershipsChart");

  // Destroy existing chart if exists
  if (chartInstances.monthlyMembershipsChart) {
    chartInstances.monthlyMembershipsChart.destroy();
  }

  const labels = data.map((item) => {
    const [year, month] = item.month.split("-");
    return `${month}/${year}`;
  });
  const values = data.map((item) => parseInt(item.count));

  chartInstances.monthlyMembershipsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Yeni Üyelik Sayısı",
          data: values,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

// Initialize app
checkAuth();
