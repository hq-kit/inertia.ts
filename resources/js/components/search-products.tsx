import { GridList, SearchField } from '@/components/ui';
import { Product } from '@/types';
import axios from 'axios';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import CategoryIcon from './category-icon';

interface Props {
    onAction: (item: Product) => void;
}

export default function SearchProducts({ onAction }: Props) {
    const [search, setSearch] = React.useState('');
    const [products, setProducts] = React.useState<Product[]>([]);
    const handleSearch = useDebouncedCallback(async (value) => {
        setSearch(value);
        if (value) {
            const { data } = await axios.get(
                route('products.all', { q: value }),
            );
            setProducts(data);
        } else {
            setProducts([]);
        }
    }, 300);

    function getProductById(id: number | string) {
        const product = products.find((item) => item.id === id);
        if (product) {
            onAction(product);
        }
    }

    return (
        <>
            <SearchField aria-label="Search" onChange={handleSearch} />
            <GridList
                aria-label="Products"
                layout="grid"
                className="mt-2"
                items={products}
                selectionMode="none"
                onAction={getProductById}
            >
                {(product) => (
                    <GridList.Item
                        className="cursor-pointer border"
                        id={product.id}
                        textValue={product.name}
                    >
                        <CategoryIcon category={product.category.slug} />
                        {product.name}
                    </GridList.Item>
                )}
            </GridList>
        </>
    );
}
