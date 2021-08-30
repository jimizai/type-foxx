export const CURD = {
  paginate(): MethodDecorator {
    return (target, key, descriptor: any) => {
      const oldMethod = descriptor.value;
      descriptor.value = async function () {
        // eslint-disable-next-line
        return await oldMethod.apply(this, arguments);
      };
      return descriptor;
    };
  },
};
