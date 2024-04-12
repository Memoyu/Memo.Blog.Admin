import { useState } from 'react';

export function useData<T>(
    initialData: T | undefined = undefined
): [data: T | undefined, loading: boolean, (data: T) => void, (loading: boolean) => void] {
    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState(false);

    return [data, loading, setData, setLoading];
}
