import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, StackDivider, useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';


interface RequestDistribution {
  group3001: number;
  group3002: number;
  group3003: number;
  group3004: number;
  group3005: number;
}

interface RequestLog {
  timestamp: string;
  group: string;
  amount: number;
  status: string;
}

const NodeInstances: React.FC = () => {
  const [requestDistribution, setRequestDistribution] = useState<RequestDistribution | null>(null);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const toast = useToast();

  // Fetch request distribution from the backend
  useEffect(() => {
    fetch('http://localhost:4567/nginx/request_distribution')
      .then((response) => response.json())
      .then((data) => setRequestDistribution(data))
      .catch((error) => {
        console.error('Error fetching request distribution:', error);
        toast({
          title: 'Error fetching request distribution',
          description: 'Unable to fetch the request distribution from the backend.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  // Function to fetch logs for the selected group
  const fetchLogs = (group: string) => {
    fetch(`http://localhost:4567/logs/${group}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.logs) {
          setLogs(data.logs);
          setSelectedGroup(group);
          setIsOpen(true);  // Open modal when logs are fetched
        }
      })
      .catch((error) => {
        console.error('Error fetching logs:', error);
        toast({
          title: 'Error fetching logs',
          description: `Unable to fetch logs for ${group}.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // Modal close handler
  const closeModal = () => {
    setIsOpen(false);
    setSelectedGroup(null);
    setLogs([]);
  };

  if (!requestDistribution) {
    return <Text>Loading...</Text>;  // Show loading text until data is fetched
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" width="100%" mb={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Node.js Instances - Request Distribution</Text>
      <VStack divider={<StackDivider />} spacing={4} align="stretch">
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.300" boxShadow="md">
          <Text>Group 1 Requests: {requestDistribution.group3001}</Text>
          <Button onClick={() => fetchLogs('group3001')}>View Logs</Button>
        </Box>
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.300" boxShadow="md">
          <Text>Group 2 Requests: {requestDistribution.group3002}</Text>
          <Button onClick={() => fetchLogs('group3002')}>View Logs</Button>
        </Box>
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.300" boxShadow="md">
          <Text>Group 3 Requests: {requestDistribution.group3003}</Text>
          <Button onClick={() => fetchLogs('group3003')}>View Logs</Button>
        </Box>
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.300" boxShadow="md">
          <Text>Group 4 Requests: {requestDistribution.group3004}</Text>
          <Button onClick={() => fetchLogs('group3004')}>View Logs</Button>
        </Box>
        <Box p={4} borderWidth={1} borderRadius="md" bg="gray.300" boxShadow="md">
          <Text>Group 5 Requests: {requestDistribution.group3005}</Text>
          <Button onClick={() => fetchLogs('group3005')}>View Logs</Button>
        </Box>
      </VStack>

      {/* Modal to show logs */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logs for {selectedGroup}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxHeight="400px" overflowY="auto">
              {logs.length > 0 ? (
                logs.map((log, index) => {
                  const statusColor = log.status === 'success' ? 'blue' : 'red';
                  return (
                    <Text key={index} color={statusColor}>
                      {log.timestamp} - {log.group}: Amount of incoming requests: {log.amount}, Status: {log.status}
                    </Text>
                  );
                })
              ) : (
                <Text>No logs available for this group.</Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NodeInstances;