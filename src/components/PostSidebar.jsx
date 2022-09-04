import { Box, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { HiCollection, HiOutlineCollection } from 'react-icons/hi'
import { AiOutlineRetweet } from 'react-icons/ai'
import { FaRegCommentDots } from 'react-icons/fa'
import { RiShareForwardLine } from 'react-icons/ri'

export default function PostSidebar() {

  return (
    <Box ml={7} mt="auto" mb={5}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mb={1}>
       <IconButton  icon={<HiOutlineCollection size={30}/>}    />
        <Text>2</Text>
       </Box>

       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<AiOutlineRetweet size={30} />} />
        <Text>2</Text>
       </Box>
       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<FaRegCommentDots size={30}/>}   />
        <Text>2</Text>
       </Box>
       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<RiShareForwardLine size={30}/>}    />
        <Text>2</Text>
       </Box>
    </Box>
  )
}
