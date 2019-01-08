const StarNotary = artifacts.require('StarNotary')
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style

contract('StarNotary', accounts => { 

    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]


    let name = 'awesome star!'
    let symbol = "BAN"
    let starId = 1
    let name2 = 'awesome star2!'
    let starId2 = 2

  

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })

        describe('can create a star', () => { 


                it('can create a star and get its name', async function () { 
                     // Add your logic here 
                     await this.contract.createStar(name,symbol, starId,{from: user1})                 
                     assert.equal(await this.contract.ownerOf(starId), user1)

                })

        })

    describe('star uniqueness', () => { 
        it('allows only unique stars to be minted', async function() { 
            // first we mint our first star
            await this.contract.createStar(name,symbol,starId,{from: user1})
            // then we try to mint the same star, and we expect an error
            await expectThrow(this.contract.createStar(name,starId,{from: user1}))
    
        })

        it('mints unique stars', async function() { 

            for(let i = 0; i < 10; i ++) { 
                let id = i
                let newRa = i.toString()
                let newDec = i.toString()
                let newMag = i.toString()

                await this.contract.createStar(name,symbol,id, {from: user1})
                let starInfo = await this.contract.lookUptokenIdToStarInfoMap(id)
                assert.equal(starInfo[0], name)       
            }
        })
    })



    describe('exchanging and transfer of stars', async () => { 

        beforeEach(async function () {       
            await this.contract.createStar(name,symbol,starId, {from: user1})
            await this.contract.createStar(name2,symbol,starId2, {from: user2})
            await this.contract.exchangeStars(user1, user2, starId,starId2, {from: user1})
        })           

        it('exchanges the ownernship of stars between user 1 and user 2', async function () { 

            assert.equal(await this.contract.ownerOf(starId), user2)
            assert.equal(await this.contract.ownerOf(starId2), user1)            
        })

        it('transfers ownernship of star from user2 to user 1', async function () { 
            await this.contract.transferStar(user1, starId, {from: user2})//after exchange starId belongs to user2

            assert.equal(await this.contract.ownerOf(starId), user1)            
        })
    })


    describe('retrieving star information', () => { 

        beforeEach(async function () { 
            await this.contract.createStar(name,symbol,starId, {from: user1})
            })

        it('checks if star exists', async function () { 
                // Add your logic here           
            let result = await this.contract.checkIfStarExists(starId,{from: user1})
            assert.equal(result, true)
            })
        })    
})

var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return 
    }

    assert.fail('expected an error, but none was found')
}