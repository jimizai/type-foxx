import { makeAfterMethodDecoratorForControllerAndInjectService } from './utils';

export const CURD = {
  // 分页查询
  paginate: () =>
    makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
      const { current, pageSize } = instance.request.query;
      const [data, total] = await instance.service.paginate(
        current as any,
        pageSize as any
      );
      return instance.setData(data).setTotal(total).succeed();
    }),

  // 展示一条
  show: makeAfterMethodDecoratorForControllerAndInjectService(
    async (instance) => {
      const result = await instance.service.show(instance.ctx.params.id);

      return instance.setData(result).succeed();
    }
  ),

  // 创建储存数据
  store: makeAfterMethodDecoratorForControllerAndInjectService(
    async (instance) => {
      const result = await instance.service.store(
        (instance.request as any).body
      );

      return instance.setData(result).succeed();
    }
  ),

  // 更新
  update: makeAfterMethodDecoratorForControllerAndInjectService(
    async (instance) => {
      const result = await instance.service.update(
        instance.ctx.params.id,
        (instance.request as any).body
      );

      return instance.setData(result).succeed();
    }
  ),

  // 删除
  destroy: makeAfterMethodDecoratorForControllerAndInjectService(
    async (instance) => {
      const id = String(instance.ctx.params.id).includes(',')
        ? String(instance.ctx.params.id).split(',')
        : instance.ctx.params.id;

      const result = await instance.service.delete(id);

      return instance.setData(result).succeed();
    }
  ),
};
