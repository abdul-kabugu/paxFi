import {gql} from '@apollo/client'
import {apolloClient} from '../Authentication/apoloClient'
import useSignIn from '../Authentication/useSignIn'
import {signText, signedTypeData, splitSignature} from '../../ether-service'
import {v4 as uuidv4} from 'uuid'
import { useMoralis,  useMoralisFile} from 'react-moralis'
import { lensHub } from '../../lens-hub'

const CREATE_COLLECT_TYPED_DATA = `
  mutation($request: CreateCollectRequest!) { 
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        pubId
        data
      }
     }
   }
 }
`;

// TODO typings
const createCollectTypedData = (createCollectTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_COLLECT_TYPED_DATA),
    variables: {
      request: createCollectTypedDataRequest,
    },
  });
};

const useCollect = () => {
const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
const  thePrfId = user?.attributes.lensProfileId
  const createCollect = async (postId) => {
    if(!thePrfId){
        alert("connect  your  profile first")
     }

     const collectRequest = {
        publicationId: postId,
     }
     try{
     const result = await createCollectTypedData(collectRequest);
     const typedData = result.data.createCollectTypedData.typedData;
     const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
     const { v, r, s } = splitSignature(signature);

     const tx = await lensHub.collectWithSig({
        collector: account,
        profileId: typedData.value.profileId,
        pubId: typedData.value.pubId,
        data: typedData.value.data,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
      console.log(tx.hash);
    } 
        
    
     catch (error) {
        alert(error)
     }

  }
  return {createCollect}
}
export default useCollect