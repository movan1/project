import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Input } from '@nextui-org/react';

import { paths } from '@shared/router';

export const FindOrderPage: FC = () => {
  const navigate = useNavigate();

  const [table, setTable] = useState<null | number>(null);

  const handleRedirectToOrder = () => {
    navigate(`${paths.order.path}/${table}`);
  };

  return (
    <div className="py-3 px-6 w-full flex flex-col">
      <div className="text-2xl font-bold mb-5">Оплата стола</div>
      <div className="flex flex-col flex-grow gap-3 mb-10 justify-center items-center">
        <div className="flex flex-col gap-3 w-1/2">
          <h3 className="text-center text-xl">Введите номер стола</h3>
          <Input
            className="w-7/12 mx-auto"
            onValueChange={(x) => setTable(Number(x))}
            type="number"
          />
          <Button
            className="w-1/2 mx-auto"
            color="primary"
            isDisabled={!table}
            onPress={handleRedirectToOrder}
            variant="shadow"
          >
            Найти заказ
          </Button>
        </div>
      </div>
    </div>
  );
};
