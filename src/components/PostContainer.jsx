import { Heading, Box, Avatar, Text, Button, color, IconButton } from '@chakra-ui/react'
import React, {useState, useEffect, useRef} from 'react'
import {fakeVideos} from '../fakeVideos'
import PostSidebar from './PostSidebar'
import { TiUserAdd } from 'react-icons/ti'
import { FaPlay,  FaPause } from 'react-icons/fa'
import { useMoralis } from 'react-moralis'
import moment from 'moment'
//import { Indexed } from 'ethers/lib/utils'
import useCreateFollow from '../graphql/profile/createFollowTypedData'
import { Link } from 'react-router-dom'

export default function PostContainer({data, isLoading, isError}) {
  const [isPlaying, setisPlaying] = useState(false)
  const [curentPlay, setcurentPlay] = useState(0)
  const [profileToFollow, setProfileToFollow] = useState()
  const [userRunes, setUserRunes] = useState(0)
  const [daysStreak, setDaysStreak] = useState(-1)
  const [isHolder, setIsHolder] = useState(false)
  const {Moralis, account, isAuthenticated} = useMoralis()


    //  function to handle  gamificatin
    const getCoins = async () => {
      const users = Moralis.Object.extend("runeCollectors")
      const query = new Moralis.Query(users)
      query.equalTo("ethAddress", account)
      const data = await query.first();
      const {daysInArow, lastCollected, runes} = data?.attributes;
      if(moment(lastCollected).isBefore(moment.utc(), "minutes")){
          if(isHolder){
              data.increment("runes", holders[daysInArow])
              data.set("lastCollected", moment.utc().format())
              setUserRunes(runes + days[daysInArow]);
          } else if(isAuthenticated) {
          data.increment("runes", days[daysInArow])
          data.set("lastCollected", moment.utc().format())
          setUserRunes(runes + days[daysInArow]);
          }
          if(daysInArow === 6){
              data.set("daysInArow", 0)
              setDaysStreak(0)
          }else {
              data.increment("daysInArow")
              setDaysStreak(daysInArow +1)
          }
          data.save()

      }
  }
   const days = [1, 1, 1, 1, 1,1, 1]
   const holders = [20, 20, 20, 20, 20, 20, 40]
   const {follow} = useCreateFollow()
   const  handlePostToFollow  = (post) => {
        setProfileToFollow(post)

   }
   const handleFollow = async (account) => {
    setProfileToFollow(account)
      await follow(profileToFollow?.profile?.id)
   }
    console.log("this is from post container", profileToFollow?.profile.id)
  const itemsRef = useRef([]);
    useEffect(() => {
      itemsRef.current = itemsRef.current.slice(0, data?.explorePublications.length)
    }, [])
    
    const onVideoPause = (index) => {
      itemsRef.current[index].pause()
      setisPlaying(false)
    }
    const onPlayVideo = async (index) => {
      setcurentPlay(index) 
      itemsRef.current[curentPlay].pause()
      itemsRef.current[index].play()
      setisPlaying(true)
      await getCoins()
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
        // console.log("this  is  my  video id", index) 
       }
       //console.log("current playing", curentPlay)
  return (
    <Box >
      
       
        {data?.explorePublications?.items.map((post, i) => {
          
          return(
            
            <Box mb={4} key={i}>
            
              <Box display="flex" >
               <Box >
                <Avatar  name = {post.profile.handle}    src={post.profile?.picture?.original?.url}   size="lg"  />
                </Box>
                   <Box>
                   <Box ml={7}>
                    <Text colorScheme ="blackAlpha.900" fontWeight="bold" fontSize="lg">{post.profile.name  || post.profile.handle}</Text>
                     <Text
                     fontSize="sm" cursor="pointer"
                     bgGradient="linear(to-l, #7928CA, #FF0080)"
                      bgClip="text"
                     > <Link to={`/${post.profile.id}`}> @{post.profile.handle} </Link></Text>
                     <Text mb={3}>{post.metadata.content || post.metadata.description}</Text>
                   </Box>
                   <Box w="100%"  display="flex">
                   
                    {post.metadata.media?.map((media, index) => {

                      return(
                       <Box w="280px" h="465px" bgColor="black" ml={7} borderRadius="12px" key={index}>
                        
                         <video src={media.original.url} style={{width: "280px", height:"465px", objectFit: "cover", borderRadius: "13px"}}
                     loop ref={el =>  itemsRef.current[i] = el} 
                    ></video>
                       </Box>
                      )
                    })}
                   
                   
                   <PostSidebar data = {post}/>
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

                   <Button ml="auto" colorScheme="cyan" variant="outline" leftIcon={<TiUserAdd size={20}/>} onClick={() => handleFollow(post
                    )}>follow</Button>
              </Box>
            </Box>
          )
        })}
       
    </Box>
  )
}


