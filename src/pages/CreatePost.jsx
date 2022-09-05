import React, {useState} from 'react'
import {Box, Heading, Button, Text} from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import UploadFile from '../components/UploadFile'
import PostSettings from '../components/PostSettings'
import {useMoralis, useMoralisFile} from 'react-moralis'
export default function CreatePost() {
 const [page,setPage] = useState(0)
 const [caption, setcaption] = useState("")
  const [postFile,setPostFile] = useState([])
  const [postFileUri, setpostFileUri] = useState(null)
  const {saveFile, isUploading : isUploadingFile, moralisFile, error: uploadingError} = useMoralisFile()
   const componentsList = [
    UploadFile, PostSettings
   ]
     
    const nextPage = () => {
      if(page < componentsList.length -1){
        setPage(page +1)
      }
    }
    const prevPage = () => {
      if(page > 0){
        setPage(page  -1)
      }
    }

      const  handleUploadFile = async () => {
        const result = await saveFile("postMedia", postFile, { saveIPFS: true });
        setpostFileUri(result.ipfs())
          console.log(result.ipfs())
         
          return result
       }
     const pageSteps = () => {
      if(page === 0){
        return(
          <UploadFile  postFile = {postFile} setPostFile ={setPostFile}
           handleUpload = {handleUploadFile} postFileUri ={postFileUri}
            isUploading ={ isUploadingFile} isUploadingError = {uploadingError}
            setpostFileUri ={setpostFileUri}
            />
        )
      }else if(page === 1){
        return(
          <PostSettings  mediaURI = {postFileUri} setMedia = {setpostFileUri}/>
        )
      }
     }
  return (
    <Box w="90%" mx="auto" >
        <Navbar />
      <Box h="88vh">
    
        <Box>{pageSteps()}</Box>
         
        
         <Box  w="230px" ml="auto" display="flex" justifyContent="space-between" mt={3}>
         <Button onClick={prevPage} w="100px" colorScheme="cyan" variant="outline">prev</Button>
         <Button onClick={nextPage} w="100px" colorScheme="cyan" variant="outline">next</Button>
         </Box>
      </Box>
    </Box>
  )
}
