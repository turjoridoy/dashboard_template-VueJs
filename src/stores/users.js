import { showNotification } from "@/utilities/common";
import { usersApi } from "@/api/users";
import { rolesApi } from "@/api/roles";
import { permissionsApi } from "@/api/permissions";

/* ----- USER ----- */
export const getUsers = async () => {
  let res = [];
  try {
    res = await usersApi.list();
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.users || [];
};

export const createUser = async (form) => {
  let result = false;
  try {
    const res = await usersApi.create(form);
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.email?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updateUser = async (id, form) => {
  let result = false;
  try {
    const res = await usersApi.update(id, form);
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.email?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const deleteUser = async (id) => {
  console.log(id);
  let result = false;
  try {
    const res = await usersApi.remove(id);
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message);
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

/* ----- ROLE ----- */
export const getRoles = async () => {
  let res = [];
  try {
    res = await rolesApi.list();
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.role || [];
};

export const createRole = async (form) => {
  let result = false;
  try {
    const res = await rolesApi.create(form);
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updateRole = async (id, form) => {
  let result = false;
  try {
    const res = await rolesApi.update(id, form);
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message?.email?.at(-1) || res?.data?.message)
    if (res?.data?.status?.toLowerCase() == 'success') result = true
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message)
  }

  return result
}
export const deleteRole = async (id) => {

  let result = false;
  try {
    const res = await rolesApi.remove(id);
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message)
    if (res?.data?.status?.toLowerCase() == 'success') result = true
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message)
  }

  return result
}
/* ----- PERMISSION ----- */
export const getPermissions = async () => {
  let res = [];
  try {
    res = await permissionsApi.list();
  } catch (error) {
    res = [];
    showNotification("error", error?.response?.data?.message || error?.message);
  }
  return res?.data?.permissions || [];
};

export const createPermission = async (form) => {

  const name = form?.name?.toLowerCase().replace(/\s+/g, '-');
  let result = false;
  try {
    const res = await permissionsApi.create(name);
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const updatePermission = async (id, form) => {
  const name = form?.name?.toLowerCase().replace(/\s+/g, '-');
  let result = false;
  try {
    const res = await permissionsApi.update(id, name);
    showNotification(
      res?.data?.status?.toLowerCase(),
      res?.data?.message?.name?.at(-1) || res?.data?.message
    );
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};

export const deletePermission = async (id) => {
  let result = false;
  try {
    const res = await permissionsApi.remove(id);
    showNotification(res?.data?.status?.toLowerCase(), res?.data?.message);
    if (res?.data?.status?.toLowerCase() == "success") result = true;
  } catch (error) {
    result = false;
    showNotification("error", error?.response?.data?.message || error?.message);
  }

  return result;
};