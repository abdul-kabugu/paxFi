import { useQuery } from '@apollo/client'
import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import {GET_PUBLICATIONS_COMMENTS} from '../graphql/publication/getPostComments'
import { useMoralis } from 'react-moralis'
import useCreateComment from '../graphql/publication/createComment'

export default function PostComments({postId}) {
  const {createComment} = useCreateComment()
  const {user} = useMoralis()
  const {data: postComments, loading : isPostCommentsLoading, error: isPostCommntsError} = useQuery(GET_PUBLICATIONS_COMMENTS, {
    variables : {
      request : {
        commentsOf :    postId,  //postId              
      }
    }
  }) 

  const createNewComment = async (caption, postId) => {
    await createComment(caption, postId)
  }
  console.log("the post comments", postComments )
  return (
   <Box w="100%"  p={3} >
     {postComments?.publications.items.map((post, i) => {

      return(
        <Box display="flex"  mb={4}>
        <Avatar  name={post.profile.handle} src={post.profile.picture.original.url}  mr={4} cursor="pointer"/>
     <Box>
         <Text colorScheme ="blackAlpha.900" fontWeight="semibold" fontSize="lg">{post.profile.name || post.profile.handle}</Text>
         <Text>{post.metadata.content}</Text>
         </Box>
        
         </Box>
      )
     })}

        
      
        </Box>
   

  )
}

{/*
 <Box display="flex" justifyContent="space-between" >
       <Avatar  name='abdul'  mr={2} cursor="pointer"/>
    <Box>
        <Text colorScheme ="blackAlpha.900" fontWeight="semibold" fontSize="lg">abdul kabugu</Text>
        <Text>this is comment  texts by general  this is comment  texts by general this is comment  texts by general this is comment  texts by general this is comment  texts by general this is comment  texts by general</Text>
        </Box>
       
        </Box>

*/}