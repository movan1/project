import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  useDisclosure
} from '@nextui-org/react';

import { ProductList } from '@widgets/product-list';

import {
  useAddAdminOrderMutation,
  useEditOrderMutation,
  useEditOrderStatusMutation,
  useGetOrdersQuery
} from '@entities/order';
import { useGetTablesListQuery } from '@entities/table';

import {
  NewWaiterOrder, Order, OrderType, Statuses
} from '@shared/types';

import { columns } from './orders.table';

const ValidNewStatuses = Object
  .values(Statuses)
  .filter((x) => typeof x === 'number' && x !== Statuses.Created) as Statuses[];

export const AdminOrdersPage: FC = () => {
  const { data: ordersList = [] } = useGetOrdersQuery();
  const { data: tablesList = [] } = useGetTablesListQuery();
  const [createOrder, { isLoading: isCreateLoading }] = useAddAdminOrderMutation();
  const [editOrder, { isLoading: isEditLoading }] = useEditOrderMutation();
  const [editOrderStatus, { isLoading: isEditStatusLoading }] = useEditOrderStatusMutation();

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<NewWaiterOrder>({
    defaultValues: {
      orderTable: null,
      products: []
    }
  });

  const {
    isOpen, onClose, onOpen, onOpenChange
  } = useDisclosure();
  const {
    isOpen: isStatusOpen,
    onClose: onStatusClose,
    onOpen: onStatusOpen,
    onOpenChange: onStatusOpenChange
  } = useDisclosure();
  const [orderID, setOrderID] = useState<null | number>(null);
  const [status, setStatus] = useState<Statuses | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleCloseStatusModal = () => {
    onStatusClose();
    setStatus(null);
  };

  const handleOpenStatusModal = (id: number) => {
    onStatusOpen();
    setOrderID(id);
  };

  const handleEditStatus = () => {
    if (orderID && status) {
      editOrderStatus({ id: orderID, status })
        .unwrap()
        .then(() => handleCloseStatusModal());
    }
  };

  const handleCloseOrderModal = () => {
    onClose();
    setIsEdit(false);
    clearErrors();
    setValue('products', []);
    setValue('orderTable', null);
  };

  const handleOpenOrderEditModal = (order: Order) => {
    setIsEdit(true);
    setOrderID(order.id);
    setValue('orderTable', order.orderTable);
    setValue('products', order.products.map((x) => x.id));
    onOpen();
  };

  const renderCell = (row: Order, columnKey: number | string) => {
    if (columnKey === 'date') {
      return new Date(row.date).toLocaleString();
    }

    if (columnKey === 'orderType') {
      if (row.orderType === OrderType.Self) {
        return (
          <Chip
            variant="flat"
          >
            {OrderType[row.orderType]}
          </Chip>
        );
      }

      if (row.orderType === OrderType.Hall) {
        return (
          <Chip
            color="primary"
            variant="flat"
          >
            {OrderType[row.orderType]}
          </Chip>
        );
      }
    }

    if (columnKey === 'status') {
      if (row.status === Statuses.Created) {
        return (
          <Chip
            color="secondary"
            variant="flat"
          >
            {Statuses[row.status]}
          </Chip>
        );
      }

      if (row.status === Statuses.Completed) {
        return (
          <Chip
            color="success"
            variant="flat"
          >
            {Statuses[row.status]}
          </Chip>
        );
      }

      if (row.status === Statuses.Canceled) {
        return (
          <Chip
            color="danger"
            variant="flat"
          >
            {Statuses[row.status]}
          </Chip>
        );
      }
    }

    if (columnKey === 'totalPrice') {
      if (row.tips) {
        return `${row.totalPrice}  ₽ (${row.tips} ₽)`;
      }
      return `${row.totalPrice}  ₽`;
    }

    if (columnKey === 'products') {
      return row.products.map((x) => `${x.name} (${x.price} ₽)`).join(', ');
    }

    if (columnKey === 'actions') {
      if (row.status !== Statuses.Created) return null;
      return (
        <div className="inline-flex gap-3">
          <Button
            color="warning"
            onClick={() => handleOpenOrderEditModal(row)}
            variant="flat"
            isIconOnly
          >
            <i className="far fa-edit translate-x-0.5" />
          </Button>
          <Button
            color="secondary"
            onClick={() => handleOpenStatusModal(row.id)}
            title="Изменить статус"
            variant="flat"
            isIconOnly
          >
            <i className="fas fa-tasks" />
          </Button>
        </div>
      );
    }

    return getKeyValue(row, columnKey);
  };

  const handleAddOrderSubmit = (data: NewWaiterOrder) => {
    if (!isEdit) {
      createOrder(data)
        .unwrap()
        .then(() => handleCloseOrderModal());
    }

    if (orderID && isEdit) {
      editOrder({ id: orderID, ...data })
        .unwrap()
        .then(() => handleCloseOrderModal());
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            color="primary"
            endContent={<i className="fas fa-plus" />}
            onClick={onOpen}
            variant="shadow"
          >
            Создать заказ
          </Button>
        </div>
        <Table aria-label="users table">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="Заказов нет">
            {ordersList.map((x) => (
              <TableRow key={x.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(x, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseOrderModal}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>
            {isEdit ? 'Редактирование' : 'Добавление'}
            {' '}
            заказа
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              id="add-new-order"
              onSubmit={handleSubmit(handleAddOrderSubmit)}
            >
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Select
                    onChange={(x) => {
                      if (x.target.value !== '') {
                        onChange(Number(x.target.value));
                      } else {
                        onChange(null);
                      }
                    }}
                    errorMessage={errors.orderTable?.message}
                    isDisabled={isEdit}
                    isInvalid={Boolean(errors.orderTable?.message)}
                    isRequired={!isEdit}
                    label="Стол"
                    placeholder="Выберите стол"
                    selectedKeys={[String(value ?? '')]}
                  >
                    {
                      tablesList.map(({ description, id }) => (
                        <SelectItem key={String(id)}>{`Стол ${id} | ${description}`}</SelectItem>
                      ))
                    }
                  </Select>
                )}
                control={control}
                name="orderTable"
                rules={{ validate: { check: (v) => isEdit || v !== null || 'Поле обязательно для заполнения' } }}
              />
              <Controller
                render={({ field: { onChange, value } }) => (
                  <ProductList
                    error={errors.products?.message}
                    onChange={onChange}
                    value={value}
                  />
                )}
                control={control}
                name="products"
                rules={{ validate: { required: (x) => x.length > 0 || 'Поле обязательно для заполнения' } }}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseOrderModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="primary"
              form="add-new-order"
              isLoading={isCreateLoading || isEditLoading}
              type="submit"
            >
              {isEdit ? 'Редактировать' : 'Добавить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isStatusOpen}
        onClose={handleCloseStatusModal}
        onOpenChange={onStatusOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Редактирование статуса заказа</ModalHeader>
          <ModalBody>
            <Select
              onSelectionChange={(x) => {
                if (x.currentKey) {
                  setStatus(Number(x.currentKey) as Statuses);
                } else {
                  setStatus(null);
                }
              }}
              label="Статус"
              placeholder="Выберите статус"
              selectedKeys={[String(status ?? '')]}
              isRequired
            >
              {
                ValidNewStatuses.map((x) => (
                  <SelectItem key={x}>
                    {Statuses[x]}
                  </SelectItem>
                ))
              }
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseStatusModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="primary"
              form="add-new-order"
              isDisabled={status === null}
              isLoading={isEditStatusLoading}
              onPress={handleEditStatus}
            >
              Изменить статус
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
