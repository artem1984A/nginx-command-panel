import React, { useState } from 'react';
import { Box, Button, Container, Heading, Text, Input, FormControl, FormLabel, useToast, Flex} from '@chakra-ui/react';
import NodeInstances from './components/NodeInstances'; // Assuming the NodeInstances component is in the same directory.

const App: React.FC = () => {
  const [status, setStatus] = useState("inactive");
  const [activeConnections, setActiveConnections] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [servers, setServers] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const toast = useToast();

  const checkStatus = () => {
    // Simulate an API call or status check
    setStatus("active");
    setActiveConnections(120);
    setTotalRequests(5000);
  };

  const reloadNginx = () => {
    // Simulate reloading Nginx config
    toast({
      title: "Nginx configuration reloaded",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const updateServers = () => {
    if (servers) {
      // Simulate updating the backend servers
      toast({
        title: "Backend servers updated",
        description: `New servers: ${servers}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setServers("");
    } else {
      toast({
        title: "Error",
        description: "Please enter valid server addresses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:4567/nginx/logs');
      const data = await response.json();
      setLogs(data.logs); // Assuming the logs are returned as an array
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError('Error fetching logs');
    }
  };
  const startTest = async () => {
    try {
      const response = await fetch('http://localhost:4567/start-test', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Test Started",
          description: "The test is running.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error starting the test:", error);
      toast({
        title: "Test Error",
        description: "Unable to start the test.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };




  return (
    <Container maxW="container.xl" centerContent>
    <Box
  as="footer"
  width="100%"
  py={4}
  bgGradient="linear(to-r, teal.500, purple.500)"
  color="white"
  textAlign="center"
  position="relative"  // Changed from "fixed" to "relative" for proper page flow
  mt={4}  // Margin-top to add space above the footer
>
  <Text fontSize="lg">Nginx Load Balancer Command Panel</Text>
</Box>

      <Flex direction={['column', 'row']} gap={4} width="100%">
        {/* Left Side */}
        <Box p={4} borderWidth={1} borderRadius="lg" width={['100%', '50%']} mb={4} mt={4}>
          <Heading size="md" mb={4}>Current Nginx Status</Heading>
          <Button colorScheme="teal" onClick={checkStatus}>Check Status</Button>
          <Text mt={4}>Status: {status}</Text>
          <Text>Active Connections: {activeConnections}</Text>
          <Text>Total Requests: {totalRequests}</Text>
        </Box>


      {/* Nginx Logs Panel */}
      <Box p={4} borderWidth={1} borderRadius="lg" width="100%" mb={4} mt={4}>
        <Heading size="md" mb={4}>Nginx Logs</Heading>
        <Button colorScheme="purple" onClick={fetchLogs}>Refresh Logs</Button>
        {error && <Text color="red.500" mt={2}>{error}</Text>}
        <Box mt={4} maxHeight="300px" overflowY="auto" border="1px" borderColor="gray.200" p={2}>
          {logs.length === 0 ? (
            <Text>No logs available</Text>
          ) : (
            logs.map((log, index) => <Text key={index}>{log}</Text>)
          )}
        </Box>  
        </Box>

        {/* Right Side */}
        <Box p={4} borderWidth={1} borderRadius="lg" width={['100%', '50%']} mb={4}>
          <Heading size="md" mb={4}>Node.js Instances</Heading>
          <NodeInstances /> {/* Render Node instances here */}
          <Heading size="md" mb={4}>Start Test</Heading>
        <Button colorScheme="blue" onClick={startTest}>Start Test</Button>
        </Box>
      </Flex>

      <Box p={4} borderWidth={1} borderRadius="lg" width="100%" mb={4}>
        <Heading size="md" mb={4}>Reload Nginx Configuration</Heading>
        <Button colorScheme="blue" onClick={reloadNginx}>Reload</Button>
      </Box>

      <Box p={4} borderWidth={1} borderRadius="lg" width="100%" mb={4}>
        <Heading size="md" mb={4}>Update Backend Servers</Heading>
        <FormControl>
          <FormLabel>Enter comma-separated server addresses</FormLabel>
          <Input
            type="text"
            value={servers}
            onChange={(e) => setServers(e.target.value)}
            placeholder="Enter server addresses"
            mb={4}
          />
          <Button colorScheme="green" onClick={updateServers}>Update Servers</Button>
        </FormControl>
      </Box>
    </Container>
  );
};

export default App;