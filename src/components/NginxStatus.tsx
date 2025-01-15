// src/components/NginxStatus.tsx

import React, { useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

// Define types for the status response
interface NginxStatusResponse {
  status: string;
  active_connections: number;
  total_requests: number;
}

const NginxStatus: React.FC = () => {
  const [status, setStatus] = useState<NginxStatusResponse | null>(null);

  const getStatus = async () => {
    try {
      const response = await fetch('http://localhost:4567/nginx/status');
      const data: NginxStatusResponse = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching Nginx status', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        <Button onClick={getStatus} colorScheme="teal">Check Status</Button>
        {status && (
          <Box p={4} border="1px" borderColor="gray.200">
            <Text>Status: {status.status}</Text>
            <Text>Active Connections: {status.active_connections}</Text>
            <Text>Total Requests: {status.total_requests}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NginxStatus;