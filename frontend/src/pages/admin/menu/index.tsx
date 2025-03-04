import {
  FC, useEffect, useState
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  Button, Input,
  Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader,
  Table, TableBody, TableCell,
  TableColumn, TableHeader, TableRow,
  Textarea, getKeyValue, useDisclosure
} from '@nextui-org/react';

import { ProductList } from '@widgets/product-list';

import {
  useAddMenuMutation, useDeleteMenuMutation, useEditMenuMutation, useGetAdminMenuQuery
} from '@entities/menu';
import { useGetProductsQuery } from '@entities/product';

import { useUser } from '@shared/hooks';
import { paths } from '@shared/router';
import { HasId, MenuSectionAdmin } from '@shared/types';

import { columns } from './menu.table';

export const AdminMenuPage: FC = () => {
  const { data: productList = [] } = useGetProductsQuery();
  const { data: menuAdmin = [] } = useGetAdminMenuQuery();
  const [createMenu, { isLoading: isCreateLoading }] = useAddMenuMutation();
  const [editMenu, { isLoading: isEditLoading }] = useEditMenuMutation();
  const [deleteMenu, { isLoading: isDeleteLoading }] = useDeleteMenuMutation();

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<MenuSectionAdmin>({
    defaultValues: {
      description: '',
      name: '',
      productList: []
    }
  });

  const {
    isOpen, onClose, onOpen, onOpenChange
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onClose: deleteOnClose,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange
  } = useDisclosure();

  const navigate = useNavigate();
  const { isAdmin } = useUser();
  const [menuID, setMenuID] = useState<null | number>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleCloseMenuModal = () => {
    onClose();
    setIsEdit(false);
    clearErrors();
    setValue('name', '');
    setValue('description', '');
    setValue('productList', []);
  };

  const handleOpenMenuEditModal = (menu: HasId & MenuSectionAdmin) => {
    setIsEdit(true);
    setMenuID(menu.id);
    setValue('name', menu.name);
    setValue('description', menu.description);
    setValue('productList', menu.productList);
    onOpen();
  };

  const handleOpenDeleteMenuModal = (id: number) => {
    setMenuID(id);
    deleteOnOpen();
  };

  const handleCloseDeleteMenuModal = () => {
    setMenuID(null);
    deleteOnClose();
  };

  const handleDeleteMenu = () => {
    if (menuID) {
      deleteMenu(menuID)
        .unwrap()
        .then(() => handleCloseDeleteMenuModal());
    }
  };

  const handleControlMenuSection = (data: MenuSectionAdmin) => {
    if (!isEdit) {
      createMenu(data)
        .unwrap()
        .then(() => handleCloseMenuModal());
    }

    if (menuID && isEdit) {
      editMenu({ id: menuID, ...data })
        .unwrap()
        .then(() => handleCloseMenuModal());
    }
  };

  const renderCell = (row: HasId & MenuSectionAdmin, columnKey: number | string) => {
    if (columnKey === 'productList') {
      if (productList.length > 0) {
        return row.productList.map((x) => productList.filter((y) => y.id === x)[0].name).join(', ');
      }
    }

    if (columnKey === 'actions') {
      return (
        <div className="inline-flex gap-3">
          <Button
            color="warning"
            onClick={() => handleOpenMenuEditModal(row)}
            variant="flat"
            isIconOnly
          >
            <i className="far fa-edit translate-x-0.5" />
          </Button>
          <Button
            color="danger"
            onClick={() => handleOpenDeleteMenuModal(row.id)}
            variant="flat"
            isIconOnly
          >
            <i className="fas fa-trash-alt" />
          </Button>
        </div>
      );
    }

    return getKeyValue(row, columnKey);
  };

  useEffect(() => {
    if (!isAdmin()) navigate(paths.adminOrders.path);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <Button
            color="primary"
            endContent={<i className="fas fa-plus" />}
            onClick={onOpen}
            variant="shadow"
          >
            Добавить раздел меню
          </Button>
        </div>
        <Table aria-label="menu section table">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="Пока разделов нет">
            {menuAdmin.map((x) => (
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
        onClose={handleCloseMenuModal}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>
            {isEdit ? 'Редактирование' : 'Добавление'}
            {' '}
            раздела меню
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              id="add-new-menu"
              onSubmit={handleSubmit(handleControlMenuSection)}
            >
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Input
                    errorMessage={errors.name?.message}
                    isInvalid={Boolean(errors.name?.message)}
                    label="Название"
                    onChange={onChange}
                    placeholder="Название раздела меню"
                    value={value}
                    isRequired
                  />
                )}
                control={control}
                name="name"
                rules={{ required: 'Поле обязательно для заполнения' }}
              />
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Textarea
                    errorMessage={errors.description?.message}
                    isInvalid={Boolean(errors.description?.message)}
                    label="Описание"
                    onChange={onChange}
                    placeholder="Описание раздела меню"
                    rows={5}
                    value={value}
                    disableAutosize
                    isRequired
                  />
                )}
                control={control}
                name="description"
                rules={{ required: 'Поле обязательно для заполнения' }}
              />
              <div>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <ProductList
                      error={errors.productList?.message}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  control={control}
                  name="productList"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseMenuModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="primary"
              form="add-new-menu"
              isLoading={isCreateLoading || isEditLoading}
              type="submit"
            >
              {isEdit ? 'Редактировать' : 'Добавить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteMenuModal}
        onOpenChange={deleteOnOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Удаление раздела меню</ModalHeader>
          <ModalBody>
            Вы точно хотите удалить раздел меню?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseDeleteMenuModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="danger"
              isLoading={isDeleteLoading}
              onClick={handleDeleteMenu}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
