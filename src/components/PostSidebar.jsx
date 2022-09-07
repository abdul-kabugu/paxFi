import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import React, {useState} from 'react'
import { HiCollection, HiOutlineCollection } from 'react-icons/hi'
import { AiOutlineFileAdd, AiOutlineRetweet } from 'react-icons/ai'
import { FaRegCommentDots } from 'react-icons/fa'
import { RiShareForwardLine } from 'react-icons/ri'
import PostComments from './PostComments'
import useCreateComment from '../graphql/publication/createComment'
import useCreateMirror from '../graphql/publication/createMirror'
import MirrorModal from './MirrorModal'
import useCollect from '../graphql/publication/createCollect'
import { truncateString } from '../hooks/substringTxt'

export default function PostSidebar({data}) {
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [postToComment, setPostToComment] = useState()
  const [comentTxt, setComentTxt] = useState("")
  const [postToMirror, setPostToMirror] = useState()
  const [isMirrorModal, setisMirrorModal] = useState(false)
  const [isCollectModal, setIsCollectModal] = useState(false)
  const [postToCollect, setPostToCollect] = useState()

    const handleOpenComment = (post) => {
      setPostToComment(post)
      isCommentOpen ? setIsCommentOpen(false) : setIsCommentOpen(true)
    }
    const closeCommentDrawer = () =>  {
      setIsCommentOpen(false)
    }

    const handleMirror = async (post) => {
      setPostToMirror(post)
      setisMirrorModal(true)
      //await createMirror(post?.id)
    }
    
    const handleCloseMirror = () => {
      setisMirrorModal(false)
    }

    const handleOpenCollectModal = (post) => {
      setPostToCollect(post)
      setIsCollectModal(true)
    }
    const handlCloseCollectModal = () => {
      setIsCollectModal(false)
    }
    const {createComment} = useCreateComment()
    const {createMirror} = useCreateMirror()
    const {createCollect} = useCollect()
     const thePostId = postToComment?.id
     console.log("the post id ", thePostId)
   // const createNewComment = async (caption, postId ) => {
     // await createComment(caption, postId)
    //}
  
    console.log("the opened comment", postToCollect)
  return (
    <Box ml={7} mt="auto" mb={5}>
      <Drawer isOpen={isCommentOpen} placement="right" onClose={closeCommentDrawer} >
      <DrawerOverlay  />
         <DrawerContent>
          <DrawerCloseButton />
           <DrawerHeader>Comments</DrawerHeader>

          <DrawerBody>
           <PostComments postId={postToComment?.id} />
          </DrawerBody>
          
          <DrawerFooter>
            <Box border="1px" borderColor="gray.100" h={129} w="100%" >
              <Textarea value={comentTxt} onChange={e => setComentTxt(e.target.value)} border="1px"borderRadius={8} borderColor="gray.400" resize={false}></Textarea>
            <Button colorScheme="cyan" w="100%" mx="auto" px={3} mt={3} onClick={() => createComment(comentTxt, thePostId)}>comment </Button>
            </Box>
           
          </DrawerFooter>
         </DrawerContent>
      </Drawer>
      <Modal isOpen={isMirrorModal} onClose ={handleCloseMirror} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
           Mirror Post
        
        </ModalHeader>
          <ModalCloseButton   />
           <ModalBody>
           <MirrorModal  postId = {postToMirror?.id} postCreator = {postToMirror?.profile.handle}
            postContent = {postToMirror?.metadata.content} totalCollectors = {postToMirror?.stats.totalAmountOfCollects}
           
           />
           </ModalBody>
           <ModalFooter>
            <Button leftIcon={<AiOutlineRetweet />} w={170} colorScheme="cyan" onClick={() => createMirror(postToMirror?.id)}>Mirror  Post</Button>
           </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCollectModal} onClose ={handlCloseCollectModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
           Collect Modal
        
        </ModalHeader>
          <ModalCloseButton   />
           <ModalBody>
           <Box>
      <Text fontWeight="semibold" fontSize={25} mb={3}>Post by @{postToCollect?.profile.handle}</Text>
       <Text color="gray.700">{postToCollect? truncateString(postToCollect?.metadata.content, 60) : ""}</Text>
        </Box>
           </ModalBody>
           <ModalFooter>
            <Button leftIcon={<HiOutlineCollection/>} w={170} colorScheme="cyan" onClick={() => createCollect(postToCollect?.id)}>Collect  Post</Button>
           </ModalFooter>
        </ModalContent>
      </Modal>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mb={1}>
       <IconButton  icon={<HiOutlineCollection size={30}/>}    onClick={() => handleOpenCollectModal(data)}/>
        <Text>2</Text>
       </Box>

       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<AiOutlineRetweet size={30} />} onClick= {() => handleMirror(data)}/>
        <Text>{data.stats.totalAmountOfMirrors}</Text>
       </Box>
       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<FaRegCommentDots size={30}/>}  onClick={() => handleOpenComment(data)} />
        <Text>{data.stats.totalAmountOfComments}</Text>
       </Box>
       <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column"  mb={1}>
       <IconButton  icon={<RiShareForwardLine size={30}/>}    />
        <Text>2</Text>
       </Box>
    </Box>
  )
}
