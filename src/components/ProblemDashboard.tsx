// src/components/ProblemDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, Badge } from '@chakra-ui/react';

interface Problem {
  id: number;
  description: string;
  status: string;
  timestamp: string;
}

const ProblemDashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:4567/problems');
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    
    fetchProblems();
  }, []);

  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Problem Dashboard</Text>
        {problems.map(problem => (
          <Box
            key={problem.id}
            p={4}
            border="1px"
            borderRadius="md"
            borderColor={problem.status === "critical" ? "red.500" : "yellow.500"}
            width="100%"
          >
            <Text><strong>Description:</strong> {problem.description}</Text>
            <Text><strong>Timestamp:</strong> {new Date(problem.timestamp).toLocaleString()}</Text>
            <Badge colorScheme={problem.status === "critical" ? "red" : "yellow"}>{problem.status}</Badge>
          </Box>
        ))}
        <Button colorScheme="teal" onClick={() => alert('Simulate adding problem')}>Simulate New Problem</Button>
      </VStack>
    </Box>
  );
};

export default ProblemDashboard;