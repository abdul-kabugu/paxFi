import { Box, Heading, HStack, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react'
import React from 'react'
import { FaTag } from 'react-icons/fa'

export default function TrendingTags() {
  return (
   <Box >
   
    <Text fontSize="lg" fontWeight="medium"  colorScheme="blackAlpha.900" my={6}>Suggested hashtags</Text>
      <HStack spacing={4} mt={5}>
        <Tag colorScheme="cyan">
            <TagLabel>Bitcoin</TagLabel>
        </Tag>
        <Tag colorScheme="cyan">
            <TagLabel>comedy</TagLabel>
        </Tag>
        <Tag colorScheme="cyan">
            <TagLabel>music</TagLabel>
        </Tag>
        <Tag colorScheme="cyan">
            <TagLabel>Ripple</TagLabel>
        </Tag>
   
     
        
        </HStack>
   </Box>
  )
}
