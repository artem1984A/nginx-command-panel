// src/components/ReloadNginx.tsx

import React from 'react';
import { Button } from '@chakra-ui/react';

const ReloadNginx: React.FC = () => {
  const reloadNginx = async () => {
    try {
      const response = await fetch('http://localhost:4567/nginx/reload', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error reloading Nginx', error);
    }
  };

  return (
    <Button onClick={reloadNginx} colorScheme="blue">
      Reload Nginx
    </Button>
  );
};

export default ReloadNginx;