function showShiftToast(title: string, error) {
  const toast = useToast();

  toast.add({
    title: title,
    description: error,
    icon: "i-mi-warning",
    color: "red",
  });
}