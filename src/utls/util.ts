export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null) {
      formData.append(key, value);
    }
  });
  return formData;
};
