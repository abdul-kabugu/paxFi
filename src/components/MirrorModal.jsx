import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import {GET_PUBLICATION_REVENUE} from "../graphql/publication/postRevenue"
import { useQuery } from '@apollo/client'
import { truncateString } from '../hooks/substringTxt'
import { FiUsers } from 'react-icons/fi'
export default function MirrorModal({postId, postCreator,  postContent}) {
    /*const {data, loading, error} = useQuery(GET_PUBLICATION_REVENUE, {
        variables : {
            request : {
                publicationId : postId
            }
        }
    })*/

    //console.log("data from post revenue", data)
  return (
    <Box>
      <Text fontWeight="semibold" fontSize={25} mb={3}>Post by @{postCreator}</Text>
     <Text color="gray.700">{truncateString(postContent, 60)}</Text>
      

    </Box>
  )
}
