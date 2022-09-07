import { Heading, Box,Text, Avatar, Button, IconButton } from '@chakra-ui/react'
import React, {useState} from 'react'
import { MdOutlinePersonAdd } from 'react-icons/md'
import useCreateFollow from '../graphql/profile/createFollowTypedData'
export default function HomeSidebar({ data, isDataLoading, }) {
  const [profileToFollow, setProfileToFollow] = useState()
  const {follow}  = useCreateFollow()
 const handleFollow = async (account) => {
  setProfileToFollow(account)
    await follow(profileToFollow?.id)
 }
 console.log("the account to follow",  profileToFollow)
  return (
    <Box>
 
        <Text fontSize="xl" fontWeight="medium" colorScheme="blackAlpha.900" my={4}>Creators you might like</Text>
         <Box>
            {data?.recommendedProfiles.filter((profile) => profile.name !== null).
             map((profiles, i) =>
            {
               
                return(
                    <Box key={i} display="flex"  py={3} w="90%" maxHeight="200px" p={4} >
                      <Avatar name={profiles?.handle}  src={profiles?.picture?.original.url}  mr={6} size="sm" />
                      <Box>
                      <Text  colorScheme ="blackAlpha.900" fontWeight="semibold">{profiles?.name}</Text>
                      <Text  fontSize="sm" cursor="pointer"
                       bgGradient="linear(to-l, #7928CA, #FF0080, cyan)"
                        bgClip="text"

                      >@{profiles?.handle}</Text>
                      </Box>
                      <Box ml="auto">
                        <IconButton      icon={<MdOutlinePersonAdd size={25} color="#78D6B9"/>}     border="1px" borderColor="#5AC8C8"    onClick={() => handleFollow(profiles)}  />
                      </Box>
                    </Box>
                )
            })}
         </Box>

    </Box>
  )
}
