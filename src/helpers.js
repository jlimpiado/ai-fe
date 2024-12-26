import {AES, enc} from 'crypto-js';
import {getUser} from "@/supabase.js";

const key = import.meta.env.VITE_SECRET_KEY;

export const encryptData = (data) => {
  return AES.encrypt(data, key).toString();
}

export const decryptData = (data) => {
  return AES.decrypt(data, key).toString(enc.Utf8);
}

export const getSessionData = () => {
  const data = sessionStorage.getItem('session');
  if(!data) return data;
  const {id, username, type} = JSON.parse(decryptData(data));
  return {
    id,
    username,
    type
  }
}

export const setSessionData = (data) => {
  const encrypted = encryptData(JSON.stringify(data));
  sessionStorage.setItem('session', encrypted);
}

export const clearSessionData = () => {
  sessionStorage.removeItem('session');
}

export async function getName(id) {
  return getUser(id).then(res => {
    const {data} = res;
    return `${data.first_name} ${data.last_name}`
  })
}
