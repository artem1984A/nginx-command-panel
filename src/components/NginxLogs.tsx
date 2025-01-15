import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Spinner, Button } from '@chakra-ui/react';

interface NginxLogResponse {
  logs: string[];
}

const NginxLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4567/nginx/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data: NginxLogResponse = await response.json();
      setLogs(data.logs);
    } catch (error) {
      setError('Error fetching logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();  // Fetch logs when the component is mounted
  }, []);

  return (
    <Box borderLeft="2px" borderColor="gray.300" p={4} width="30%" position="fixed" right={0} top={0} bottom={0}>
      <VStack spacing={4} align="start">
        <Text fontSize="xl" fontWeight="bold">Nginx Logs</Text>
        <Button colorScheme="teal" onClick={fetchLogs} isLoading={loading}>
          Refresh Logs
        </Button>
        
        {error && <Text color="red.500">{error}</Text>}

        {loading ? (
          <Spinner />
        ) : (
          <Box overflowY="auto" maxHeight="80vh" width="100%">
            {logs.map((log, index) => (
              <Text key={index} fontSize="sm" whiteSpace="pre-wrap">
                {log}
              </Text>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NginxLogs;