import { Button } from 'antd';
import React, { useState } from 'react';

import s from './index.less';

export const LogAccess: React.FC = () => {
  const [title, setTitle] = useState<string>('访问日志');
  return (
    <div>
      {title}
      <Button className={s.styles}>按钮</Button>
    </div>
  );
};

export default LogAccess;
