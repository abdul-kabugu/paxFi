import { Box, Heading, Textarea, Text, Button, Select, Tooltip, Avatar, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React, {useState} from 'react'
import { } from 'react-icons/io'
import { AiOutlineClose } from 'react-icons/ai'
import {BsPercent} from 'react-icons/bs'
import useCreatePost from '../graphql/publication/createPostTypedData'
import { useMoralis } from 'react-moralis'
import moment from 'moment'
export default function PostSettings({mediaURI,  setMedia}) {

  const [caption, setCaption] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState([])
  const [addTag, setaddTag] = useState("")
  const [selectedModule, setSelectedModule] = useState("freeCollectModule")
  const [selectedCurrency, setselectedCurrency] = useState("0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889")
  const [postPrice, setPostPrice] = useState("")
  const [refferalFee, setrefferalFee] = useState("")
  const [postRefrence, setPostRefrence] = useState("false")
  const {account, Moralis, isAuthenticated} = useMoralis()
  const [isHolder, setIsHolder] = useState(false)
  const [userRunes, setUserRunes] = useState(0)
  const [daysStreak, setDaysStreak] = useState(-1)
  const addNewTag = (event) => {
   if(event.key === "Enter" && addTag !== "" && tag.length < 5){
     setTag([...tag, addTag])
     setaddTag("")
    
  }
  }
//console.log(selectedModule)
   const removeTag = (index) => {
    setTag([...tag.filter(tags => tag.indexOf(tags) !== index)])
   }

  const {createPost} = useCreatePost()
  // convert  the  referral  to  number
   const parsedReferral = parseFloat(refferalFee)
  // get post module
  const thePostModule = () => {
    if(selectedModule  === "freeCollectModule"){
       const collectModule  = {
        freeCollectModule : {
          followerOnly : false
       }
      }
      return  collectModule
    } else if(selectedModule ===  "feeCollectModule"){
         const collectModule = {
          feeCollectModule: {
            amount : {
              currency : selectedCurrency,
              value : postPrice,
            },
            recipient : account,
            referralFee : parsedReferral,
            followerOnly  :  false
           }
        }
        return  collectModule
      }
      
  }

    const getPostRefrenceModule = () => {
       if(postRefrence === "true"){
        const  referenceModule = {
          followerOnlyReferenceModule : true,
        }
        return referenceModule
       }else if(postRefrence === "false"){
        const  referenceModule = {
          followerOnlyReferenceModule : false,
        }
        return referenceModule
       }
    }
   const createNewPost = async (mydescription, mycaption, tags, myMediaURI,   mycollectModule, mypostRefrence, thePostModule, getPostRefrenceModule) => {
    try{
     await createPost(mydescription, mycaption, tags, myMediaURI, mycollectModule, mypostRefrence, thePostModule, getPostRefrenceModule)
    } catch(error) {
      console.log("this error when  creating post", error)
    }
   }

     // get coins  function

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
  return (
    <Box w="100%" h="79vh" mx="auto"  padding={1} display="flex">
      <Box w="90%" h="92%" mx="auto" mt={10} display="flex" justifyContent="space-between">
       
        <Box w="40%" >
        <Heading mb={4}>Details </Heading>
          <Textarea    value={caption} onChange={e =>  setCaption(e.target.value)} border="1px" borderColor="gray.400" 
            placeholder='Post caption' resize="none" maxLength={100} mb={5}
          />

    <Textarea    value={description} onChange={e =>  setDescription(e.target.value)} border="1px" borderColor="gray.400" 
            placeholder='Post description' resize="none" maxLength={100}  h={200}
          />
          <Box border="1px" borderColor="gray.400" borderRadius={4} p={5} mt={3} display="flex" flexWrap="wrap">
            {tag.map((item, i) => {

              return(
                <ul key={i} className="tagList">
                  <li className='tagItem'>{item} {<AiOutlineClose style={{marginLeft : "5px", cursor : "pointer"}}
                  onClick={() => removeTag(i)}
                  />}</li>
                </ul>
              )
            })}
            <input type="text" value={addTag}   className="tags-input"  placeholder='press enter to add tags'
             onKeyUp={event => addNewTag(event)} onChange={e => setaddTag(e.target.value)}
            />
          </Box>
        </Box>
        <Box   w="40%" >
       <Heading mb={3}>  Modules </Heading>
       
          <Select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}
           border="1px" borderColor="gray.400" size="lg"
          >
          <option value='freeCollectModule'>Free to collect</option>
          <option value='feeCollectModule'>Paid to collect</option>
          
          
          </Select>
          <Box w="100%" h={79} border="1px" borderColor="gray.400" mt={3} borderRadius={7}  p={2}  >
          <Text fontSize="small" mb={1} fontWeight="semibold">Collect Fee</Text>
          <Box display="flex"  justifyContent="space-between" mt={0}>
            <input  type="number"  value={postPrice} onChange={e => setPostPrice(e.target.value)}    placeholder="00:0"  className='input-currency'        />

             <Box >
              
              <Box display="flex">
                <Select value={selectedCurrency} onChange={e => setselectedCurrency(e.target.value)} w={100} border="1px" borderColor="gray.300" size="sm" borderRadius={6}>
                  <option value="0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e">USDC</option>
                  <option value="0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889">WMATIC</option>
                </Select>
                {selectedCurrency === "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" ? (
                  <Avatar  name='matic'      src='https://cryptologos.cc/logos/polygon-matic-logo.svg?v=023' size="sm" bgColor="white" ml={6}/> 
                ) : (
                  <Avatar name="usdc"  src='https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023' size="sm" bgColor="blue" ml={6}/>
                )}
              </Box>
              </Box>
             </Box>
          
          </Box>
          
          <Box w="100%" h={70} border="1px" borderColor="gray.400" mt={3} borderRadius={7}  p={2} >
          <Text fontSize="small" mb={1} fontWeight="semibold">Referral Fee</Text>
          <Box display="flex"  justifyContent="space-between">
            <input  type="number"  value={refferalFee} onChange={e => setrefferalFee(e.target.value)}    placeholder="% 4.0"  className='input-currency'        />
             <Box >
            
                
                <BsPercent size={27} />
                
            
             </Box>
             </Box>
          
          </Box>
          <Box w="100%" h={77} border="1px" borderColor="gray.400" mt={5} borderRadius={7} display="flex" alignItems="center" p={4}>
            <RadioGroup value={postRefrence} onChange={ setPostRefrence} defaultValue="false">
            <Text fontSize="small" mb={1} fontWeight="semibold">Refrence Module</Text>
              <Stack direction="row"  spacing={5}>
                <Radio value="false"> Any one</Radio>
                <Radio value="true">Only followers</Radio>
              </Stack>
            </RadioGroup>
          </Box>
         <Button w="90%" colorScheme="cyan" ml={7} mt={5} size="lg" onClick={
          () => createNewPost(description, caption, tag,mediaURI, selectedModule, postRefrence, thePostModule, getPostRefrenceModule)}>Create Post </Button>
       </Box>
        </Box >
      
    </Box>
  )
}
