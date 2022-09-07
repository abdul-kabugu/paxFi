import {gql} from '@apollo/client'
import {apolloClient} from '../Authentication/apoloClient'
import useSignIn from '../Authentication/useSignIn'
import {signText, signedTypeData, splitSignature} from '../../ether-service'
import {v4 as uuidv4} from 'uuid'
import { useMoralis,  useMoralisFile} from 'react-moralis'
import { lensHub } from '../../lens-hub'

const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;

// TODO sort typed!
const createFollowTypedData = (followRequestInfo) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_FOLLOW_TYPED_DATA),
    variables: {
      request: {
        follow: followRequestInfo,
      },
    },
  });
};

const useCreateFollow = () => {
    const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
   const  thePrfId = user?.attributes.lensProfileId
    const  follow = async (profileId) => {
        if(!thePrfId){
            alert("connect  your  profile first")
         }

        const followRequest = [
            {
                profile : profileId,

            }
        ]
        try{
        const result = await createFollowTypedData(followRequest);
        const typedData = result.data.createFollowTypedData.typedData;
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        const { v, r, s } = splitSignature(signature);
        const tx = await lensHub.followWithSig({
            follower: account,
            profileIds: typedData.value.profileIds,
            datas: typedData.value.datas,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          });
          console.log('follow: tx hash', tx.hash);
          //return tx.hash;
        
        } catch (error) {
            console.log("this erro from follow", error)
        }
    }
    return {follow}
}
export default useCreateFollow