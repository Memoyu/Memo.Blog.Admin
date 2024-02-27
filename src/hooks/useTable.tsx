import { useState } from 'react';

export const useTable = (): [
    data: any[],
    loading: boolean,
    (data: any[]) => void,
    (loading: boolean) => void,
] => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    return [data, loading, setData, setLoading];
};
