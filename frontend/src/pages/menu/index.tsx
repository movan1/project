import { FC, useEffect } from 'react';
import {
  NavLink, useNavigate, useParams
} from 'react-router-dom';

import { Chip, Spinner } from '@nextui-org/react';

import { ProductMenuCard } from '@widgets/product-menu-card';

import { useGetMenuSectionsListQuery, useLazyGetMenuByIdQuery } from '@entities/menu';

import { paths } from '@shared/router';

export const MenuPage: FC = () => {
  const { data: menuSectionList = [] } = useGetMenuSectionsListQuery();
  const [
    getMenuById, {
      data: menuSectionData,
      isLoading
    }] = useLazyGetMenuByIdQuery();

  const { menuId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (menuSectionList.length > 0) {
      if (
        !menuId
        || (
          menuId
          && !menuSectionList
            .find((x) => String(x.id) === menuId)
        )
      ) {
        navigate(`${paths.menu.path}/${menuSectionList[0].id}`);
      } else {
        getMenuById(Number(menuId));
      }
    }
  }, [menuId, menuSectionList.length]);

  return (
    <div className="flex flex-col min-h-[100vh] w-full pt-[52px]">
      <div className="p-3 text-amber-50 flex gap-1.5 w-[766px] top-0 flex-wrap fixed z-20 bg-white">
        {menuSectionList.map((x) => (
          <NavLink
            key={x.id}
            to={`${paths.menu.path}/${String(x.id)}`}
          >
            <Chip
              color={x.id === Number(menuId) ? 'primary' : 'default'}
              variant="shadow"
            >
              {x.name}
            </Chip>
          </NavLink>
        ))}
      </div>
      <div className="p-3 flex-grow flex">
        {
          isLoading && (
            <div className="flex-grow flex items-center justify-center">
              <Spinner
                color="danger"
                size="lg"
              />
            </div>
          )
        }
        {
          menuSectionData && (
            <div className="flex-grow">
              <h1 className="text-3xl font-mono">{menuSectionData.name}</h1>
              <p className="text-medium text-gray-400 mb-5">{menuSectionData.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {menuSectionData.productList.map(
                  (product) => <ProductMenuCard key={product.id} {...product} />
                )}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};
