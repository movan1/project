import { FC } from 'react';

import { Chip } from '@nextui-org/react';

import { WeightType } from '@shared/types';

type ProductWeightProps = {
  type: WeightType
  weight: number
};

export const ProductWeight: FC<ProductWeightProps> = ({ type, weight }) => (
  <Chip className="font-mono" size="sm" variant="flat">
    {weight}
    {' '}
    {type === WeightType.Gramm && ('гр.')}
    {type === WeightType.Milliliter && ('мл.')}
  </Chip>
);
