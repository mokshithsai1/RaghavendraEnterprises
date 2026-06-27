 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import {
  useQuery,
  useMutation,


} from "@tanstack/react-query";

const API_BASE = "https://raghavendraenterprises-5kyt.onrender.com";

async function apiFetch(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ..._optionalChain([options, 'optionalAccess', _ => _.headers]),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err ).error || res.statusText);
  }
  if (res.status === 204) return undefined ;
  return res.json();
}


























































































export const getListCategoriesQueryKey = () => ["categories"] ;
export const getListProductsQueryKey = (params = {}) =>
  ["products", params] ;
export const getGetProductQueryKey = (id) => ["product", id] ;
export const getGetOrderQueryKey = (id) => ["order", id] ;
export const getListOrdersQueryKey = (params = {}) =>
  ["orders", params] ;
export const getGetAdminMeQueryKey = () => ["admin", "me"] ;
export const getGetInventorySummaryQueryKey = () => ["inventory", "summary"] ;
export const getGetDashboardStatsQueryKey = () => ["dashboard", "stats"] ;

function buildQueryString(params) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}



export function useListCategories(options) {
  return useQuery({
    queryKey: getListCategoriesQueryKey(),
    queryFn: () => apiFetch("/api/categories"),
    ..._optionalChain([options, 'optionalAccess', _2 => _2.query]),
  });
}

export function useListProducts(params = {}, options) {
  return useQuery({
    queryKey: getListProductsQueryKey(params),
    queryFn: () =>
      apiFetch(
        `/api/products${buildQueryString({
          category_id: params.category_id,
          search: params.search,
          in_stock: params.in_stock,
        })}`
      ),
    ..._optionalChain([options, 'optionalAccess', _3 => _3.query]),
  });
}

export function useGetProduct(id, options) {
  return useQuery({
    queryKey: getGetProductQueryKey(id),
    queryFn: () => apiFetch(`/api/products/${id}`),
    enabled: !!id,
    ..._optionalChain([options, 'optionalAccess', _4 => _4.query]),
  });
}

export function useGetOrder(id, options) {
  return useQuery({
    queryKey: getGetOrderQueryKey(id),
    queryFn: () => apiFetch(`/api/orders/${id}`),
    enabled: !!id,
    ..._optionalChain([options, 'optionalAccess', _5 => _5.query]),
  });
}

export function useListOrders(params = {}, options) {
  return useQuery({
    queryKey: getListOrdersQueryKey(params),
    queryFn: () =>
      apiFetch(
        `/api/orders${buildQueryString({ status: params.status, date: params.date })}`
      ),
    ..._optionalChain([options, 'optionalAccess', _6 => _6.query]),
  });
}

export function useGetAdminMe(options) {
  return useQuery({
    queryKey: getGetAdminMeQueryKey(),
    queryFn: () => apiFetch("/api/auth/me"),
    retry: false,
    ..._optionalChain([options, 'optionalAccess', _7 => _7.query]),
  });
}

export function useGetInventorySummary(options) {
  return useQuery({
    queryKey: getGetInventorySummaryQueryKey(),
    queryFn: () => apiFetch("/api/inventory/summary"),
    ..._optionalChain([options, 'optionalAccess', _8 => _8.query]),
  });
}

export function useGetDashboardStats(options) {
  return useQuery({
    queryKey: getGetDashboardStatsQueryKey(),
    queryFn: () => apiFetch("/api/dashboard/stats"),
    ..._optionalChain([options, 'optionalAccess', _9 => _9.query]),
  });
}

export function useAdminLogin(
  options
) {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useAdminLogout(options) {
  return useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/logout", { method: "POST" }),
    ...options,
  });
}

export function useCreateOrder(
  options
) {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch("/api/orders", { method: "POST", body: JSON.stringify(data) }),
    ...options,
  });
}

export function useCreateProduct(
  options
) {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch("/api/products", { method: "POST", body: JSON.stringify(data) }),
    ...options,
  });
}

export function useUpdateProduct(
  options
) {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    ...options,
  });
}

export function useDeleteProduct(
  options
) {
  return useMutation({
    mutationFn: ({ id }) =>
      apiFetch(`/api/products/${id}`, { method: "DELETE" }),
    ...options,
  });
}

export function useUpdateOrderStatus(
  options
) {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useUpdateStock(
  options
) {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch(`/api/inventory/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}
