import { Heading, Box, Avatar, Text, Button, color, IconButton } from '@chakra-ui/react'
import React, {useState, useEffect, useRef} from 'react'
import {fakeVideos} from '../fakeVideos'
import PostSidebar from './PostSidebar'
import { TiUserAdd } from 'react-icons/ti'
import { FaPlay,  FaPause } from 'react-icons/fa'

export default function PostContainer() {
  const [isPlaying, setisPlaying] = useState(false)
  const [curentPlay, setcurentPlay] = useState(0)

  const itemsRef = useRef([]);
    useEffect(() => {
      itemsRef.current = itemsRef.current.slice(0, fakeVideos.length)
    }, [])
    
    const onVideoPause = (index) => {
      itemsRef.current[index].pause()
      setisPlaying(false)
    }
    const onPlayVideo = (index) => {
      setcurentPlay(index) 
      itemsRef.current[curentPlay].pause()
      itemsRef.current[index].play()
      setisPlaying(true)
     
    }
  const onVideoPlay = async (index) =>  {
    if(isPlaying) {
     
      itemsRef.current[index].pause()
       setisPlaying(false)
       itemsRef.current[curentPlay].pause() 
        
     }
     else {
      setcurentPlay(index)  
      itemsRef.current[curentPlay].pause()
      setisPlaying(true)
      itemsRef.current[index].play()    
       
     } 
         console.log("this  is  my  video id", index) 
       }
       console.log("current playing", curentPlay)
  return (
    <Box >
      
       
        {fakeVideos.map((post, i) => {
          
          return(
            
            <Box mb={6}>
            
              <Box display="flex" >
               <Box >
                <Avatar      name="abdul kabugu"   size="lg" />
                </Box>
                   <Box>
                   <Box ml={7}>
                    <Text colorScheme ="blackAlpha.900" fontWeight="bold" fontSize="lg">{post.handle}</Text>
                     <Text
                     fontSize="sm" cursor="pointer"
                     bgGradient="linear(to-l, #7928CA, #FF0080)"
                      bgClip="text"
                     >@{post.creator}</Text>
                     <Text mb={3}>{post.description}</Text>
                   </Box>
                   <Box w="100%"  display="flex">
                   <Box w="280px" h="465px" bg="black"  ml={7} borderRadius="12px">
                    <video src={post.vide} style={{width: "280px", height:"465px", objectFit: "cover", borderRadius: "13px"}}
                     loop ref={el =>  itemsRef.current[i] = el} 
                    ></video>
                   </Box>
                   
                   <PostSidebar />
                   </Box>
                   <Box position="relative" bottom={20}  left={10}>
                    {
                      isPlaying && curentPlay === i ? (
                        <IconButton  icon={< FaPause size={20} color='white'/>}   onClick={() => onVideoPause(i)}colorScheme="blackAlpha" />
                      ) :(
                        <IconButton  icon={<FaPlay size={20} color='white'/>}   onClick={() => onPlayVideo(i) } colorScheme="blackAlpha" />
                      )
                    }
                   </Box>
                   </Box>

                   <Button ml="auto" colorScheme="cyan" variant="outline" leftIcon={<TiUserAdd size={20}/>}>follow</Button>
              </Box>
            </Box>
          )
        })}
       
    </Box>
  )
}
