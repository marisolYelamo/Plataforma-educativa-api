export const switchProgression = async (
  type: string,
  topicfn: () => any,
  contentfn: () => any,
  modulefn: () => any
) => {
  switch (type) {
    case "topics":
      return topicfn();
    case "contents":
      return contentfn();
    case "modules":
      return await modulefn();
    default:
      throw Error("Falta el tipo de progreso");
  }
};
