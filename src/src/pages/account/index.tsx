import { Button } from 'antd';
import React, { useState } from 'react';

import s from './index.less';

export const User: React.FC = () => {
  const [title, setTitle] = useState<string>('用户管理');
  return (
    <div>
      {title}
      <Button className={s.styles}>按钮</Button>
    </div>
  );
};

export default User;
