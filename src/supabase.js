import {createClient} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// USER HANDLERS
export const getUser = async (id) => {
  return supabase.from('users').select().eq('id', id).single();
}

export const getUsers = async () => {
  return supabase.from('users').select();
}

export const addUser = async (userData) => {
  return supabase.from('users').insert(userData).select();
}

export const updateUser = async (id, userData) => {
  return supabase.from('users').update(userData).eq('id', id).select();
}

export const deleteUser = async (id) => {
  return supabase.from('users').delete().eq('id', id).select();
}

// ARTICLE HANDLERS
export const getArticles = async () => {
  return supabase.from('article').select();
}

export const getArticle = async (id) => {
  return supabase.from('article').select().eq('id', id).single();
}

export const insertArticles = async (articles) => {
  return supabase.from('article').insert(articles).select();
}

export const updateArticle = async (id, article) => {
  return supabase.from('article').update(article).eq('id', id).select();
}

// IMAGE HANDLERS
const getPath = (path) => /(?<path>\d+-.+\.(jpg|png|jpeg))/.exec(path).groups.path;

export const getImg = async (strPath) => {
  return supabase.storage.from('archintel').getPublicUrl(strPath).data.publicUrl;
}

export const uploadImg = async (file) => {
  console.log(file);
  return supabase.storage.from('archintel').upload(`${file.lastModified}-${file.name}`, file)
}

// export const updateImg = async (filePath = '', file) => {
//   const path = getPath(filePath);
//   return supabase.storage.from('archintel').update(path, file);
// }

export const deleteImg = async (filePath) => {
  const path = getPath(filePath);
  return supabase.storage.from('archintel').remove([path]);
}

// COMPANY HANDLERS
export const getCompanies = async () => {
  return supabase
    .from('company')
    .select()
}

export const getCompany = async (id) => {
  return supabase.from('company').select().eq('id', id).single();
}

export const addCompany = async (data) => {
  return supabase.from('company').insert(data).select();
}

export const updateCompany = async (id, data) => {
  return supabase.from('company').update(data).eq('id', id).select();
}

export const deleteCompany = async (id) => {
  return supabase.from('company').delete().eq('id', id).select();
}
