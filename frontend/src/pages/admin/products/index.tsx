import {
  FC, useEffect, useMemo, useState
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  Button, Chip, Image, Input,
  Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader, Pagination,
  Select, SelectItem, Table,
  TableBody, TableCell, TableColumn,
  TableHeader, TableRow, Textarea,
  getKeyValue, useDisclosure
} from '@nextui-org/react';

import {
  defaultProduct,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetProductsQuery
} from '@entities/product';

import { useUser } from '@shared/hooks';
import { paths } from '@shared/router';
import {
  Product, ProductWithoutID, WeightType
} from '@shared/types';

import { columns } from './products.table';

const rowsPerPage = 10;

export const AdminProductsPage: FC = () => {
  const { data: productList = [] } = useGetProductsQuery();
  const [addProduct, { isLoading: isAddLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: isEditLoading }] = useEditProductMutation();
  const [deleteProduct, { isLoading: isDeleteLoading }] = useDeleteProductMutation();

  const {
    isOpen, onClose, onOpen, onOpenChange
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onClose: alertOnClose,
    onOpen: alertOnOpen,
    onOpenChange: alertOnOpenChange
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onClose: deleteOnClose,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange
  } = useDisclosure();

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<ProductWithoutID>({ defaultValues: defaultProduct });

  const [productID, setProductID] = useState<null | number>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [productPreview, setProductPreview] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const { isAdmin } = useUser();
  const navigate = useNavigate();

  const pages = Math.ceil(productList
    .filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
    .length / rowsPerPage);

  const handleCloseProductModal = () => {
    onClose();
    clearErrors();
    setIsEdit(false);
    setProductPreview('');
    setProductID(null);
    Object
      .entries(defaultProduct)
      .map(([key, value]) => setValue(key as keyof ProductWithoutID, value));
  };

  const handleAlertClose = () => {
    alertOnClose();
    if (!isError) handleCloseProductModal();
  };

  const handleControlProduct = (form: ProductWithoutID) => {
    const formattedData = { ...form };

    formattedData.name = form.name.trim();
    formattedData.description = form.description.trim();
    formattedData.price = Number(form.price);
    formattedData.weight = Number(form.weight);
    formattedData.weightType = Number(form.weightType);
    formattedData.inStopList = Boolean(form.inStopList);

    if (
      typeof form.preview === 'string'
      && form.preview.trim().length === 0
    ) {
      delete formattedData.preview;
    }

    if (!isEdit) {
      // for (const x of JSON.parse(xData)) {
      //   const xForm = {
      //     description: x.description,
      //     inStopList: false,
      //     name: x.name,
      //     preview: x.image,
      //     price: Number(x.price),
      //     weight: 750,
      //     weightType: 2
      //   };
      //   addProduct(xForm);
      // }
      addProduct(formattedData)
        .unwrap()
        .then(() => setIsError(false))
        .catch(() => setIsError(true))
        .finally(() => {
          alertOnOpen();
        });
    }

    if (productID && isEdit) {
      editProduct({ ...formattedData, id: productID })
        .unwrap()
        .then(() => setIsError(false))
        .catch(() => setIsError(true))
        .finally(() => {
          alertOnOpen();
        });
    }
  };

  const handleOpenProductEditModal = (x: Product) => {
    const { id, ...data } = x;

    setProductID(id);
    Object
      .entries(data)
      .map(([key, value]) => setValue(key as keyof ProductWithoutID, value));
    if (data.preview) setProductPreview(data.preview);
    setIsEdit(true);
    onOpen();
  };

  const handleDeleteProductModal = (_productID: number) => {
    setProductID(_productID);
    deleteOnOpen();
  };

  const handleCloseDeleteProductModal = () => {
    deleteOnClose();
    setProductID(null);
  };

  const handleDeleteProduct = () => {
    if (productID) {
      deleteProduct(productID)
        .unwrap()
        .then(() => handleCloseDeleteProductModal());
    }
  };

  const renderCell = (row: Product, columnKey: number | string) => {
    if (columnKey === 'inStopList') {
      if (row.inStopList) {
        return <Chip color="danger" variant="flat">true</Chip>;
      }
      return <Chip color="success" variant="flat">false</Chip>;
    }

    if (columnKey === 'price') {
      return <span>{`${row.price} ₽`}</span>;
    }

    if (columnKey === 'actions') {
      return (
        <div className="inline-flex gap-3">
          <Button
            color="warning"
            onClick={() => handleOpenProductEditModal(row)}
            variant="flat"
            isIconOnly
          >
            <i className="far fa-edit translate-x-0.5" />
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeleteProductModal(row.id)}
            variant="flat"
            isIconOnly
          >
            <i className="fas fa-trash-alt" />
          </Button>
        </div>
      );
    }

    if (columnKey === 'description') {
      if (row.description.length > 110) {
        return `${row.description.slice(0, 110)}...`;
      }
      return row.description;
    }

    return getKeyValue(row, columnKey);
  };

  const topContent = useMemo(() => (
    <div className="flex justify-start w-1/6">
      <Input
        label="Поиск"
        onValueChange={setSearch}
        placeholder="Введите название блюда"
        value={search}
      />
    </div>
  ), [search]);

  const bottomContent = useMemo(() => (
    <div className="flex justify-center">
      <Pagination
        color="primary"
        onChange={setPage}
        page={page}
        total={pages}
        showControls
        showShadow
      />
    </div>
  ), [page, productList.length, pages]);

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
            Добавить блюдо
          </Button>
        </div>
        <Table
          aria-label="products table"
          bottomContent={bottomContent}
          topContent={topContent}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="Пока блюд нет">
            {productList
              .filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
              .slice(rowsPerPage * (page - 1), rowsPerPage * (page - 1) + rowsPerPage)
              .map((x) => (
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
        onClose={handleCloseProductModal}
        onOpenChange={onOpenChange}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <span>
              {isEdit ? 'Редактирование' : 'Создание'}
              {' '}
              блюда
            </span>
          </ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4"
              id="add-new-product"
              onSubmit={handleSubmit(handleControlProduct)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <Input
                        errorMessage={errors.name?.message}
                        isInvalid={Boolean(errors.name?.message)}
                        label="Название"
                        onChange={onChange}
                        placeholder="Название блюда"
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
                        classNames={{
                          base: 'h-full',
                          input: 'h-full',
                          inputWrapper: 'flex-grow'
                        }}
                        errorMessage={errors.description?.message}
                        isInvalid={Boolean(errors.description?.message)}
                        label="Описание"
                        onChange={onChange}
                        placeholder="Описание блюда"
                        value={value}
                        disableAutosize
                        isRequired
                      />
                    )}
                    control={control}
                    name="description"
                    rules={{ required: 'Поле обязательно для заполнения' }}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <Input
                          errorMessage={errors.weight?.message}
                          isInvalid={Boolean(errors.weight?.message)}
                          label="Вес"
                          onChange={onChange}
                          placeholder="Вес блюда"
                          type="number"
                          value={String(value)}
                          isRequired
                        />
                      )}
                      rules={{
                        min: { message: 'Минимальный вес 1 гр/мл', value: 1 },
                        required: 'Поле обязательно для заполнения'
                      }}
                      control={control}
                      name="weight"
                    />
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <Select
                          errorMessage={errors.weightType?.message}
                          isInvalid={Boolean(errors.weightType?.message)}
                          label="Выберете тип веса"
                          onChange={(x) => onChange(x.target.value)}
                          selectedKeys={[String(value)]}
                          isRequired
                        >
                          <SelectItem key={WeightType.Gramm}>
                            грамм
                          </SelectItem>
                          <SelectItem key={WeightType.Milliliter}>
                            миллилитров
                          </SelectItem>
                        </Select>
                      )}
                      control={control}
                      name="weightType"
                      rules={{ required: 'Поле обязательно для заполнения' }}
                    />
                  </div>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <Input
                        errorMessage={errors.price?.message}
                        isInvalid={Boolean(errors.price?.message)}
                        label="Цена"
                        onChange={onChange}
                        placeholder="Цена блюда"
                        type="number"
                        value={String(value)}
                        isRequired
                      />
                    )}
                    rules={{
                      min: { message: 'Минимальная цена 1 рубль', value: 1 },
                      required: 'Поле обязательно для заполнения'
                    }}
                    control={control}
                    name="price"
                  />
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onChange={(x) => {
                          if (x.target.value !== '') {
                            onChange(x.target.value === 'true');
                          } else {
                            onChange('');
                          }
                        }}
                        errorMessage={errors.inStopList?.message}
                        isInvalid={Boolean(errors.inStopList?.message)}
                        label="Стоп-лист"
                        selectedKeys={[String(value)]}
                        isRequired
                      >
                        <SelectItem key="true">
                          Да
                        </SelectItem>
                        <SelectItem key="false">
                          Нет
                        </SelectItem>
                      </Select>
                    )}
                    control={control}
                    name="inStopList"
                    rules={{ validate: { checkBool: (x) => typeof x === 'boolean' || 'Поле обязательно для заполнения' } }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <Input
                      onChange={(x) => {
                        onChange(x);
                        setProductPreview(x.target.value);
                      }}
                      errorMessage={errors.preview?.message}
                      isInvalid={Boolean(errors.preview?.message)}
                      label="Фото"
                      placeholder="https://path-to/image.png"
                      value={value}
                    />
                  )}
                  control={control}
                  name="preview"
                />
                {productPreview.trim().length > 0 && (
                  <div className="flex justify-center">
                    <Image
                      src={productPreview}
                      width={300}
                    />
                  </div>
                )}
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseProductModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="primary"
              form="add-new-product"
              isLoading={isAddLoading || isEditLoading}
              type="submit"
            >
              {isEdit ? 'Редактировать' : 'Добавить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        onOpenChange={alertOnOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {isError ? (
              <span className="text-red-600">Ошибка!</span>
            ) : 'Успех!'}
          </ModalHeader>
          <ModalBody className="text-center pb-10">
            {
              isError ? 'Произошла ошибка при выполнении запроса' : (
                <span>
                  Блюдо успешно
                  {' '}
                  {isEdit ? 'отредактировано!' : 'создано!'}
                </span>
              )
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteProductModal}
        onOpenChange={deleteOnOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Удаление блюда
          </ModalHeader>
          <ModalBody className="text-center pb-10">
            <span>Вы точно хотите удалить блюдо?</span>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={handleCloseDeleteProductModal}
              variant="light"
            >
              Закрыть
            </Button>
            <Button
              color="danger"
              isLoading={isDeleteLoading}
              onClick={handleDeleteProduct}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
