import {
  FC, useEffect, useState
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Chip,
  Input,
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
  TableHeader, TableRow, getKeyValue, useDisclosure
} from '@nextui-org/react';

import {
  useCreateUserMutation, useDeleteUserMutation, useEditUserMutation, useGetUsersQuery
} from '@entities/user';

import { useUser } from '@shared/hooks';
import { paths } from '@shared/router';
import {
  FullUser, UserRoles, UserWithId
} from '@shared/types';

import { columns } from './users.table';

const userRolesOptions = Object.values(UserRoles)
  .filter((x) => Number.isInteger(x))
  .map((x) => ({ id: x, value: UserRoles[x as UserRoles] }));

export const AdminUsersPage: FC = () => {
  const { data: usersList = [] } = useGetUsersQuery();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const [editUser, { isLoading: isEditLoading }] = useEditUserMutation();
  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<FullUser>({
    defaultValues: {
      name: '',
      password: '',
      role: UserRoles.User
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
  const [userID, setUserID] = useState<null | number>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleCloseUserModal = () => {
    onClose();
    setIsEdit(false);
    clearErrors();
    setValue('name', '');
    setValue('password', '');
    setValue('role', UserRoles.User);
  };

  const handleOpenUserEditModal = (user: UserWithId) => {
    setIsEdit(true);
    setUserID(user.id);
    setValue('name', user.name);
    setValue('role', user.role);
    onOpen();
  };

  const handleOpenDeleteUserModal = (id: number) => {
    setUserID(id);
    deleteOnOpen();
  };

  const handleCloseDeleteUserModal = () => {
    setUserID(null);
    deleteOnClose();
  };

  const handleDeleteUser = () => {
    if (userID) {
      deleteUser(userID)
        .unwrap()
        .then(() => handleCloseDeleteUserModal());
    }
  };

  const handleAddUserSubmit = (data: FullUser) => {
    if (!isEdit) {
      createUser(data)
        .unwrap()
        .then(() => handleCloseUserModal());
    }

    if (userID && isEdit) {
      editUser({ id: userID, ...data })
        .unwrap()
        .then(() => handleCloseUserModal());
    }
  };

  const renderCell = (row: UserWithId, columnKey: number | string) => {
    if (columnKey === 'role') {
      return (
        <Chip
          color={row.role === UserRoles.Admin ? 'danger' : 'default'}
          variant="flat"
        >
          {UserRoles[row.role]}
        </Chip>
      );
    }

    if (columnKey === 'actions') {
      return (
        <div className="inline-flex gap-3">
          <Button
            color="warning"
            onClick={() => handleOpenUserEditModal(row)}
            variant="flat"
            isIconOnly
          >
            <i className="far fa-edit translate-x-0.5" />
          </Button>
          <Button
            color="danger"
            onClick={() => handleOpenDeleteUserModal(row.id)}
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            color="primary"
            endContent={<i className="fas fa-plus" />}
            onClick={onOpen}
            variant="shadow"
          >
            Добавить пользователя
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
          <TableBody emptyContent="Пользователей нет">
            {usersList.map((x) => (
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
        onClose={handleCloseUserModal}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>
            {isEdit ? 'Редактирование' : 'Добавление'}
            {' '}
            пользователя
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              id="add-new-user"
              onSubmit={handleSubmit(handleAddUserSubmit)}
            >
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Input
                    errorMessage={errors.name?.message}
                    isInvalid={Boolean(errors.name?.message)}
                    label="Логин"
                    onChange={onChange}
                    placeholder="Логин пользователя"
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
                  <Input
                    errorMessage={errors.password?.message}
                    isInvalid={Boolean(errors.password?.message)}
                    isRequired={!isEdit}
                    label="Пароль"
                    onChange={onChange}
                    placeholder="Пароль пользователя"
                    value={value}
                  />
                )}
                rules={{
                  validate: {
                    required: (v) => isEdit
                      || v.trim().length > 0
                      || 'Поле обязательно для заполнения'
                  }
                }}
                control={control}
                name="password"
              />
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Select
                    onChange={(x) => {
                      const targetValue = x.target.value;

                      if (targetValue !== '') {
                        onChange(Number(targetValue));
                      } else {
                        onChange(targetValue);
                      }
                    }}
                    errorMessage={errors.role?.message}
                    isInvalid={Boolean(errors.role?.message)}
                    label="Роль"
                    placeholder="Роль пользователя"
                    selectedKeys={[String(value)]}
                    isRequired
                  >
                    {userRolesOptions.map(({ id, value: content }) => (
                      <SelectItem key={id}>
                        {content}
                      </SelectItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="role"
                rules={{ required: 'Поле обязательно для заполнения' }}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseUserModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="primary"
              form="add-new-user"
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
        onClose={handleCloseDeleteUserModal}
        onOpenChange={deleteOnOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Удаление пользователя</ModalHeader>
          <ModalBody>
            Вы точно хотите удалить пользователя?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseDeleteUserModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="danger"
              isLoading={isDeleteLoading}
              onClick={handleDeleteUser}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
