import { Button } from 'antd';
import React, { useState } from 'react';

import s from './index.less';

export const Site: React.FC = () => {
  const [title, setTitle] = useState<string>('站点信息');
  return (
    <div>
      {title}
      <Button className={s.styles}>按钮</Button>
    </div>
  );
};

export default Site;
