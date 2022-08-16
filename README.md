# Find Dups
**Background:**
Have you ever imported pictures from your phone only to realize that you've already got them!
You imported them two months ago but forgot to delete them off your phone so now you've got
duplicates.

Another situation that happens is you take pictures and send them to a friend.  The friend takes
some pictures and sends them to you along with the pictures you've already sent them.
So again, you've got duplicates.

The above situation is what this application is intended to address.

## Description
### Step 1: Configuration and initialization 
After starting this program, you are asked to provide a STORE directory which is where all of your photos are stored.
And then create an initial state of all of your pictures.  This creates a hash of all of your photos.

### Step 2: Import Photos and find duplicates
At some point you import photos from your phone to your computer and run this app (find-dups) to see if
any of the photos you've just imported are already in your **STORE**.

**First IMPORT/COPY your photos from your phone to your computer**<br/>
I copy all my pictures from my phone to an import directory **IMPORT_DIR**, and then run find-dups on that directory.
The find-dups application shows me a list of the files that are duplicates of a file I already have stored in my **STORE** directory

**Next, find the duplicates**<br/>
This program displays a table of the results along with an action button to 
- delete dup - This deletes the imported photo that is already in your store.  The app first verifies that the file 
exists and is in your **STORE** before giving you the option to delete the file.

