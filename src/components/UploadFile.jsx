import { Box, Button, Circle, Heading, IconButton, Input, Spinner, Text } from '@chakra-ui/react'
import React, {useState, useRef} from 'react'
import { FaQuestion, FaUpload } from 'react-icons/fa'
import { MdFileUpload } from 'react-icons/md'
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io'

export default function UploadFile({ postFile, setPostFile, postFileUri, handleUpload,  isUploading, isUploadingError,  setpostFileUri}) {
  const [isUp, setisUp] = useState(false)
  const [err, seterr] = useState(true)
  const fileRef = useRef()
  const handleSelectFile = () => {
    fileRef.current.click()
 }  



 const handleUploadNewVid = () => {
  setpostFileUri(null)
  setPostFile([])
  
 }

  if(isUploading){
    return(
      <Box w="80%" h="79vh"  display="flex" justifyContent="center" alignItems="center" mx="auto">
        <Spinner  
        thickness='4px'
        speed='0.90s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        
        />
      </Box>
    )
  }else if(isUploadingError){
    return(
      <Box w="80%" h="79vh"  display="flex" justifyContent="center" alignItems="center" mx="auto">
    <Text fontSize="xl" fontWeight="semibold">Something went wrong refresh the page and try again</Text>
    </Box>
    )
  }
  return (
    <Box w="100%" h="79vh" >
      {postFileUri == null ?
      <>
       <Box w="80%" borderBottom="1px" borderColor="gray.200" display="flex" justifyContent="space-between" px={7}
        h={50} alignItems="center" mx="auto" mb={5}
       >
        <Text fontSize="lg" fontWeight="semibold">Upload Video </Text>
         <FaQuestion size={18}/>
        </Box> 
        <Box w="80%" h="84%"  mx="auto">
          <Box w="100%" h="100%"  display="flex" flexDirection="column" justifyContent="center" alignItems="center"
            border="1px dashed" borderColor="gray.500" borderRadius="12px"
          >
         
            <Circle size={100} bgColor="blackAlpha.900" color="whiteAlpha.900" cursor="pointer" mb={4}>
            {<MdFileUpload size={80}/>}  
              </Circle> 
              <Heading fontSize="lg" mb={3}>Select Video To Upload</Heading> 
              <Text fontSize="sm" mb={2}>720 x 1280  resolution</Text>
        <Text fontSize="sm" mb={2}>Up to 10 minutes</Text>
        <Text>{postFile.name}</Text>
           <input type="file" ref={fileRef}  onChange={e => setPostFile(e.target.files[0])} multiple ={false} hidden />
            <Button colorScheme="cyan" w="150px" onClick={handleSelectFile} variant="outline">Select File</Button>
           
            <Button leftIcon={<FaUpload />} mt={4} colorScheme="cyan" w={200} onClick={() => handleUpload ()}>Upload Video</Button>
      
          </Box>
         
          
        </Box>
        </>
 : (
  <Box w="80%" h="80%"  mx="auto" display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
    <Circle size={110} bgColor="blackAlpha.900">
      <IoMdCheckmark  size={90} color="white"/>
    </Circle>
    <Text mt={4}>media  have been uploaded</Text>
    <Button leftIcon={<IoMdAdd />} w={200} mt={5} colorScheme="cyan" variant="outline" onClick={handleUploadNewVid}>Upload new video</Button>
  </Box>
 )} 


    </Box>
  )
}
